import { Media, ProductsResponse, VajroProduct } from "./interfaces/vajro-product.interface"
import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { Attributes, Terms } from "./interfaces/attributes.interface"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { GetProduct } from "./interfaces/get-product.interface"
import { SearchProductsDto } from "./dto/search-products.dto"
import { ListProductsDto } from "./dto/list-products.dto"
import { CustomException } from "src/custom-exception"
import { UtilsService } from "src/utils/utils.service"
import { PdpService } from "src/pdp/pdp.service"
import { Request } from "express"
import { SearchProductResponse } from "./interfaces/search-product.interface"

@Injectable()
export class ProductsService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		@Inject(forwardRef(() => PdpService))
		private pdpService: PdpService
	) {}

	async listProducts(query: ListProductsDto, req: Request): Promise<ProductsResponse> {
		const { WooCommerce } = req.user as ReqUser

		const { collection_id, name, slug, per_page, page_no, sort } = query
		let params = {}

		if (!collection_id && !slug && !name) {
			let status = 404
			throw new CustomException(
				{
					message: "Error slug/collection/name not found",
					code: "slug_or_collection_id_or_name_is_needed"
				},
				status
			)
		}
		if (collection_id) {
			params = {
				category: Number(collection_id),
				per_page: per_page,
				page: page_no,
				order: sort,
				status: "publish",
				stock_status: "instock"
			}
			const options = JSON.parse(JSON.stringify(params))

			const products = await this.findProducts(WooCommerce, options)
			if (products.length === 0) {
				let status = 404
				throw new CustomException(
					{
						message: `no products in this category ${options.category}`,
						code: "empty_product_list"
					},
					status
				)
			}

			return {
				product_list: products,
				current_page_no: page_no || 1
			}
		}

		if (name) {
			const request = WooCommerce.get(`products/categories?search=${name}`)
			const [err, searchResponse] = await this.utilsService.asyncWrapper(request)
			if (searchResponse.data.length === 0) {
				let status = 404
				throw new CustomException(
					{
						message: `no matching category for the name '${name}'`,
						code: "empty_list"
					},
					status
				)
			}

			params = {
				category: searchResponse.data[0].id,
				per_page: per_page,
				page: page_no,
				order: sort,
				status: "publish",
				stock_status: "instock"
			}

			if (err) {
				let status = 404
				throw new CustomException(
					{
						message: "No matching category found",
						code: "invalid_category_name"
					},
					status
				)
			}
			const options = JSON.parse(JSON.stringify(params))

			const products = await this.findProducts(WooCommerce, options)
			if (products.length === 0) {
				let status = 404
				throw new CustomException(
					{
						message: `no products in this category ${options.category}`,
						code: "empty_product_list"
					},
					status
				)
			}

			return {
				product_list: products,
				current_page_no: page_no || 1
			}
		}

		if (slug) {
			const request = WooCommerce.get(`products/categories?slug=${slug}`)
			const [err, response] = await this.utilsService.asyncWrapper(request)

			if (err) {
				const { status, data } = err.response

				const { code, message } = data

				throw new HttpException({ message, code }, status)
			}
			params = {
				category: response.data[0].id,
				per_page: per_page,
				page: page_no,
				order: sort,
				status: "publish",
				stock_status: "instock"
			}
			const options = JSON.parse(JSON.stringify(params))

			const products = await this.findProducts(WooCommerce, options)
			if (products.length === 0) {
				let status = 404
				throw new CustomException(
					{
						message: `no products in this category ${options.category}`,
						code: "empty_product_list"
					},
					status
				)
			}

			return {
				product_list: products,
				current_page_no: page_no || 1
			}
		}
	}

	async searchProducts(query: SearchProductsDto, req: Request): Promise<SearchProductResponse> {
		const { WooCommerce } = req.user as ReqUser

		const { search_key, per_page, page_no, sort } = query

		const params = {
			search: search_key,
			per_page: per_page,
			page: page_no,
			order: sort,
			status: "publish",
			stock_status: "instock"
		}

		const options = JSON.parse(JSON.stringify(params))

		const products = await this.findProducts(WooCommerce, options)

		const searchedProduct = products.map((product) => {
			return {
				product_id: product.product_id,
				product_name: product.product_name,
				regular_price: this.utilsService.handleEmptyNumber(product.regular_price),
				sale_price: this.utilsService.handleEmptyNumber(product.sale_price),
				inventory_quantity: product.inventory_quantity,
				discount_percentage: this.utilsService.calculateDiscount(
					product.sale_price,
					product.regular_price
				).percent,
				media: {
					media_id: this.utilsService.valueOrNull(product.media?.media_id),
					media_url: this.utilsService.valueOrNull(product.media?.media_url)
				}
			}
		})

		return {
			product_list: searchedProduct,
			current_page_no: page_no || 1
		}
	}

	async findProducts(WooCommerce: WooCommerceRestApi, options: any): Promise<VajroProduct[]> {
		const request = WooCommerce.get("products", options)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const visbleProducts = response.data.filter((product: any) => {
			return product.catalog_visibility === "visible"
		})

		return visbleProducts.map(this.vajroProduct.bind(this))
	}

	async getProduct(
		WooCommerce: WooCommerceRestApi,
		productId: string,
		variantId?: string,
		qty?: number
	): Promise<GetProduct> {
		const prodReq = WooCommerce.get(`products/${productId}`)

		const [prodErr, prodRes] = await this.utilsService.asyncWrapper(prodReq)

		if (prodErr) return Promise.reject({ error: prodErr, productId, variantId, qty })

		if (!variantId)
			return { product: prodRes.data, productId, variantId, qty, name: prodRes.data.name }

		const prodVarReq = WooCommerce.get(`products/${productId}/variations/${variantId}`)

		const [prodVarErr, prodVarRes] = await this.utilsService.asyncWrapper(prodVarReq)

		if (prodVarErr) return Promise.reject({ error: prodVarErr, productId, variantId, qty })

		return { product: prodVarRes.data, productId, variantId, qty, name: prodRes.data.name }
	}

	getProductsDetail(response: any) {
		const { status, value, reason } = response

		if (status !== "fulfilled") {
			const { error, productId, variantId, qty } = reason

			const { status, data } = error?.response

			const { code = "unknown_error", message = "Unknown Error" } = data

			return {
				error: true,
				product_id: productId,
				variant_id: variantId,
				qty,
				status,
				code,
				message
			}
		}

		const { product, productId, variantId, qty, name } = value

		const { stock_quantity, regular_price, sale_price, price, tax_status, tax_class } = product

		if (!stock_quantity) {
			return {
				error: true,
				product_id: productId,
				variant_id: variantId,
				name,
				qty,
				status: 409,
				code: "woocommerce_rest_product_no_stock",
				message: "Out of Stock"
			}
		}

		const discount = this.pdpService.calculateDiscount(sale_price, regular_price)

		return {
			product_id: productId,
			variant_id: variantId,
			inventory_quantity: stock_quantity,
			regular_price: regular_price ? Number(regular_price) : null,
			sale_price: sale_price ? Number(sale_price) : null,
			price: price ? Number(price) : null,
			discount_percentage: discount.percent,
			discount_value: discount.value,
			total_discount_value: discount.value * qty,
			name,
			qty,
			tax_status,
			tax_class
		}
	}

	vajroProduct(product: any): VajroProduct {
		const images = product.images.map((img: any): Media => {
			return {
				media_id: img.id,
				media_url: img.src
			}
		})
		const tagsFiltered = product.tags.map((tag: any): string => {
			return tag.name
		})
		return {
			product_id: product.id,
			product_name: product.name,
			regular_price: product.regular_price,
			sale_price: product.sale_price,
			inventory_quantity: product.stock_quantity,
			discount_percentage: this.utilsService.calculateDiscount(
				product.sale_price,
				product.regular_price
			).percent,
			media: images[0]
		}
	}

	async getAttributes(req: Request): Promise<Attributes[]> {
		const { WooCommerce } = req.user as ReqUser

		const attributesReq = WooCommerce.get("products/attributes")

		const [attributesErr, attributesResp] = await this.utilsService.asyncWrapper(attributesReq)

		if (attributesErr) {
			const { status, data } = attributesErr.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const sizeAndColorAttributes = attributesResp.data.filter((attribute: any) => {
			if (attribute.slug === "pa_color" || attribute.slug === "pa_size") return attribute
		})

		const attrTermsReq = Promise.all(
			sizeAndColorAttributes.map((sizeAndColorAttribute: any) => {
				return WooCommerce.get(`products/attributes/${sizeAndColorAttribute.id}/terms`)
			})
		)

		const [attrTermsErr, attrTermsResp] = await this.utilsService.asyncWrapper(attrTermsReq)

		if (attrTermsErr) {
			const { status, data } = attrTermsErr.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const attributes = sizeAndColorAttributes.map((elem: any, index: number): Attributes => {
			const { id, name, slug } = elem

			const terms = attrTermsResp[index].data.map((term: any): Terms => {
				const { id, name, slug } = term

				return {
					id,
					name,
					slug
				}
			})

			return {
				id,
				name,
				slug,
				terms
			}
		})

		return attributes
	}
}
