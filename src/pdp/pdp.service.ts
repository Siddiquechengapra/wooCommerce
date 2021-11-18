import {
	Product,
	ProductMedia,
	ProductVariant,
	filteredAttributes,
	Discount
} from "./interface/pdp.interface"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { UtilsService } from "src/utils/utils.service"
import { ConfigService } from "src/config/config.service"
import { DetailDto } from "./dto/detail.dto"
import { PdpDto } from "./dto/pdp.dto"
import { Request } from "express"
import * as toHex from "colornames"

@Injectable()
export class PdpService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		public utilsService: UtilsService,
		@Inject(forwardRef(() => ConfigService))
		public configService: ConfigService
	) {}

	pdp(query: PdpDto, req: Request): Promise<Product> {
		const { prod_id } = query

		const { WooCommerce } = req.user as ReqUser

		return this.getProduct(prod_id, WooCommerce)
	}

	async detail(query: DetailDto, req: Request) {
		const { prod_id } = query

		const { WooCommerce, store_id } = req.user as ReqUser

		const productData = await this.getProduct(prod_id, WooCommerce)

		const {
			images,
			product_name,
			description,
			short_description,
			average_rating,
			rating_count,
			regular_price,
			sale_price,
			price_range,
			discount_percentage,
			variants,
			inventory_quantity
		} = productData

		let finalDescriptionString = description

		const removeHtmlTags = (string) => {
			let finalDescriptionString = string.replace(/<[^>]*>/g, "").trim()
			finalDescriptionString = finalDescriptionString.replace(/\n/g, " ")
			finalDescriptionString = finalDescriptionString.replace(/\t/g, "")
			finalDescriptionString =
				finalDescriptionString.length > 250
					? finalDescriptionString.substring(0, 250)
					: finalDescriptionString
			return finalDescriptionString
		}

		const pdpConfig = await this.configService.pdpConfig(store_id, "v1")

		const mediaWidgetData = {
			urls: images.map((img) => ({
				media_id: this.utilsService.valueOrNull(img.media_id?.toString()),
				url: this.utilsService.valueOrNull(img.url)
			}))
		}

		const prodNameWidgetData = { product_name }

		const prodDescWidgetData = {
			product_description: description,
			short_description: short_description
				? removeHtmlTags(short_description)
				: removeHtmlTags(finalDescriptionString)
		}

		const reviewsWidgetData = { average_rating, reviews_count: rating_count }

		const prodPriceWidgetData = {
			regular_price,
			sale_price,
			price_range,
			discount_percentage: discount_percentage,
			inventory_quantity
		}

		let attributesArray = []

		variants.map((item) => {
			attributesArray.push(item.attributes)
		})

		let attributeObject = {}

		attributesArray.forEach((singleArray, index) => {
			singleArray.forEach((string) => {
				attributeObject[string.split("||")[0]]
					? attributeObject[string.split("||")[0]].add(string.split("||")[1])
					: (attributeObject[string.split("||")[0]] = new Set().add(
							string.split("||")[1]
					  ))
			})
		})
		attributesArray = []

		for (let key in attributeObject) {
			attributesArray.push({
				name: key,
				option_values: [...attributeObject[key]]
			})
		}
		const attributeIteration = (item) => {
			let str = ""
			for (let i = 0; i < item.attributes.length; i++) {
				i === 0
					? (str += `${item.attributes[i]?.split("||")[1]}`)
					: (str += `||${item.attributes[i]?.split("||")[1]}`)
			}
			return str
		}

		let newProdVariantData = {
			options: attributesArray,
			variants: variants.map((item) => {
				return {
					id: item.id.toString(),
					product_id: item.product_id.toString(),
					option_string:
						item.attributes.length > 1
							? attributeIteration(item)
							: `${item?.attributes[0]?.split("||")[1]}`,
					color_hex_code: toHex(
						(item.attributes.length > 1
							? attributeIteration(item)
							: `${item?.attributes[0]?.split("||")[1]}`
						).split("||")[1]
					),
					regular_price: item.regular_price,
					sale_price: item.sale_price,
					discount_percentage: item.discount_percentage,
					inventory_quantity: item.inventory_quantity,
					media_id: this.utilsService.valueOrNull(item.media_id?.toString())
				}
			})
		}

		const widgetsData = {
			media: mediaWidgetData,
			reviews: reviewsWidgetData,
			product_name: prodNameWidgetData,
			product_price: prodPriceWidgetData,
			variant_horizontal: newProdVariantData,
			product_description: prodDescWidgetData,
			data: { product_id: prod_id }
		}

		const PdpWidgetWithData = this.utilsService.widgetConfigAndData(pdpConfig, widgetsData)

		return {
			version: "v1",
			page_name: "pdp",
			store_id,
			...PdpWidgetWithData
		}
	}

	async getProduct(productId: string, WooCommerce: WooCommerceRestApi): Promise<Product> {
		const prodReq = WooCommerce.get(`products/${productId}`)

		const [prodErr, prodResp] = await this.utilsService.asyncWrapper(prodReq)

		if (prodErr) {
			const { status, data } = prodErr.response

			let { code, message } = data

			if (code === "woocommerce_rest_product_invalid_id") message = "Invalid Product ID"

			throw new HttpException({ code, message }, status)
		}

		const numberOfVariants = prodResp.data.variations.length

		const per_page = numberOfVariants || 10

		const params = { per_page }

		const options = JSON.parse(JSON.stringify(params))

		const prodVarReq = WooCommerce.get(`products/${productId}/variations`, options)

		const currReq = WooCommerce.get("data/currencies/current")

		const prodVarCurrReq = Promise.all([prodVarReq, currReq])

		const [prodVarCurrErr, prodVarCurrResp] = await this.utilsService.asyncWrapper(
			prodVarCurrReq
		)

		if (prodVarCurrErr) {
			const { status, data } = prodVarCurrErr.response

			let { code, message } = data

			if (code === "woocommerce_rest_product_invalid_id") message = "Invalid Product ID"

			throw new HttpException({ code, message }, status)
		}

		const prodData = prodResp.data

		const prodVarData = prodVarCurrResp[0].data

		const currencyData = prodVarCurrResp[1].data

		const productAttributes = prodData.attributes.filter((attribute) => {
			return attribute.name !== "price" && attribute.visible === true
		})
		const filteredAttributes = productAttributes.map((attribute): filteredAttributes => {
			return {
				name: attribute.name,
				options: attribute.options
			}
		})

		const prodVar = prodVarData.map((vItem: any): ProductVariant => {
			const discount = this.calculateDiscount(vItem.sale_price, vItem.regular_price)

			return {
				id: vItem.id.toString(),
				product_id: prodData.id.toString(),
				variant_name: prodData.name,
				attributes: vItem.attributes.map((attribute: any): string => {
					return `${attribute.name}||${attribute.option}`
				}),
				regular_price: this.utilsService.handleEmptyNumber(vItem.regular_price),
				sale_price: this.utilsService.handleEmptyNumber(vItem.sale_price),
				discount_percentage: discount.percent,
				inventory_quantity: vItem.stock_quantity,
				media_id: this.utilsService.valueOrNull(vItem.image?.id.toString())
			}
		})

		let images = []

		images = prodData.images.map((img: any): ProductMedia => {
			return {
				url: this.utilsService.valueOrNull(img?.src),
				media_id: this.utilsService.valueOrNull(img?.id)
			}
		})

		if (numberOfVariants) {
			prodVarData.forEach((variant: any) => {
				images.push({
					url: this.utilsService.valueOrNull(variant.image?.src),
					media_id: this.utilsService.valueOrNull(variant.image?.id)
				})
			})
		}
		const unique_images = this.utilsService.getUniqueObjectsByProp(images, "media_id")

		const tagsFiltered = prodData.tags.map((tag: any): string => tag.name)

		const discount = this.calculateDiscount(prodData.sale_price, prodData.regular_price)

		return {
			product_id: prodData.id,
			product_name: prodData.name,
			product_sku: prodData.sku,
			product_brand: null,
			slug: prodData.slug,
			permalink: prodData.permalink,
			description: prodData.description,
			short_description: prodData.short_description,
			price: this.utilsService.handleEmptyNumber(prodData.price),
			regular_price: this.utilsService.handleEmptyNumber(prodData.regular_price),
			sale_price: this.utilsService.handleEmptyNumber(prodData.sale_price),
			price_range: numberOfVariants
				? this.calculatePriceRange(prodVarData, "sale_price")
				: null,
			inventory_quantity: prodData.stock_quantity,
			product_type: prodData.type,
			date_on_sale_from_gmt: prodData.date_on_sale_from_gmt,
			date_on_sale_to_gmt: prodData.date_on_sale_to_gmt,
			on_sale: prodData.on_sale,
			purchasable: prodData.purchasable,
			virtual: prodData.virtual,
			downloadable: prodData.downloadable,
			shipping_required: prodData.shipping_required,
			shipping_taxable: prodData.shipping_taxable,
			shipping_class: prodData.shipping_class,
			shipping_class_id: prodData.shipping_class_id,
			tax_class: prodData.tax_class,
			reviews_allowed: prodData.reviews_allowed,
			average_rating: this.utilsService.handleEmptyNumber(prodData.average_rating),
			rating_count: prodData.rating_count,
			grouped_products: prodData.grouped_products,
			weight: prodData.weight,
			dimensions: {
				length: prodData.dimensions.length,
				width: prodData.dimensions.width,
				height: prodData.dimensions.height
			},
			product_attributes: filteredAttributes,
			created_at: prodData.date_created,
			updated_at: prodData.date_modified,
			tags: tagsFiltered,
			images: unique_images,
			variants: prodVar,
			currency: currencyData.code,
			discount_percentage: discount.percent
		}
	}

	calculateDiscount(salePrice: string, regularPrice: string): Discount {
		if (!salePrice || !regularPrice) return { percent: null, value: null }

		const diffBtwRegAndSale = Number(regularPrice) - Number(salePrice)

		const diffByReg = diffBtwRegAndSale / Number(regularPrice)

		return { percent: Math.round(diffByReg * 100).toString(), value: diffBtwRegAndSale }
	}

	calculatePriceRange(variantData: object[], key: string): number[] {
		const sortedVariants = variantData.sort((variantA, variantB) => {
			return variantA[key] - variantB[key]
		})
		return [
			Number(sortedVariants[0][key]),
			Number(sortedVariants[sortedVariants.length - 1][key])
		]
	}
}
