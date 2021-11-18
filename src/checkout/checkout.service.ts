import { TaxDto, TaxLocation, TaxProduct } from "src/checkout/dto/tax.dto"
import { ShippingDto } from "src/checkout/dto/shipping.dto"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { WooStoreService } from "src/woo-store/woo-store.service"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { Injectable, Inject, forwardRef } from "@nestjs/common"
import { ProductsService } from "src/products/products.service"
import { UtilsService } from "src/utils/utils.service"
import { CustomException } from "src/custom-exception"
import { PdpService } from "src/pdp/pdp.service"
import { Request } from "express"
import { ShippingMethod } from "src/checkout/interface/shipping.interface"

@Injectable()
export class CheckoutService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		@Inject(forwardRef(() => ProductsService))
		private productsService: ProductsService,
		@Inject(forwardRef(() => WooStoreService))
		private wooStoreService: WooStoreService,
		@Inject(forwardRef(() => PdpService))
		private pdpService: PdpService
	) {}

	async calculateTax(body: TaxDto, req: Request): Promise<any> {
		const { WooCommerce } = req.user as ReqUser

		const { customer_id, use_location, products, location } = body

		const taxLocation = use_location
			? location
			: await this.getCustomerAddress(WooCommerce, customer_id)

		const productsPromise = products.map((product: TaxProduct) => {
			const { product_id, variant_id, qty } = product

			return this.productsService.getProduct(WooCommerce, product_id, variant_id, qty)
		})

		const productsReq = Promise.allSettled(productsPromise)

		const [productsErr, productsResp] = await this.utilsService.asyncWrapper(productsReq)

		if (productsErr) {
			const { status, data } = productsErr.response

			const { code, message } = data

			throw new CustomException({ code, message }, status)
		}

		const productsDetail = productsResp.map((res: any) => this.getProductsDetail(res))

		const taxSettings = await this.wooStoreService.getWooStoreSettings({ types: ["tax"] }, req)

		const {
			woocommerce_tax_round_at_subtotal,
			woocommerce_price_display_suffix,
			woocommerce_prices_include_tax
		} = taxSettings.tax_setting.reduce((acc: any, elem: any) => {
			const { id, value, options } = elem

			acc[id] = { value, options }

			return acc
		}, {})

		const taxInclusive = woocommerce_prices_include_tax === "yes" ? true : false

		const roundAtSubtotal = woocommerce_tax_round_at_subtotal["value"] === "yes"

		const taxDisplaySuffix = woocommerce_price_display_suffix["value"]

		const taxRates = await this.getTaxRates(WooCommerce, taxLocation)

		const productsWithTax = productsDetail.map((product: any) => {
			const { tax_status, error } = product

			if (error) return product

			if (tax_status !== "taxable") return product

			return this.getProductTax(product, taxRates, roundAtSubtotal, taxDisplaySuffix)
		})

		const {
			total: totalTax,
			discount,
			salesPrice,
			...taxValueWithName
		} = productsWithTax.reduce(
			(acc: any, product: any) => {
				const {
					error,
					total_tax_value,
					tax_value_with_name,
					total_discount_value,
					total_sale_price
				} = product

				if (error) return acc

				acc["total"] += total_tax_value

				acc["discount"] += total_discount_value

				acc["salesPrice"] += total_sale_price

				Object.entries(tax_value_with_name).forEach((elem: any[]) => {
					const [key, value] = elem

					const keyInAcc = acc[key]

					const roundTax = roundAtSubtotal ? value : Math.round(value)

					if (keyInAcc) return (acc[key] += roundTax)

					acc[key] = roundTax
				})

				return acc
			},
			{ total: 0, discount: 0, salesPrice: 0 }
		)

		const roundTotalTax = roundAtSubtotal ? Math.round(totalTax) : totalTax

		const shippingTax = 0

		const shippingAndHandling = 0

		return {
			tax_inclusive: taxInclusive,
			products: productsWithTax,
			price_breakup: [
				{
					label: "Sub Total",
					value: salesPrice
				},
				{
					label: "Discount",
					value: discount
				},
				{
					label: "Estimate Tax",
					value: roundTotalTax + shippingTax
				},
				{
					label: "Total Product Tax",
					value: roundTotalTax
				},
				{
					label: "Shipping Tax",
					value: shippingTax
				},
				{
					label: "Shipping & Handling",
					value: shippingAndHandling
				},
				{
					label: "Tax Values with Name",
					value: taxValueWithName
				}
			],
			shipping_options: [
				{
					id: 1234,
					label: "Free Shipping",
					value: shippingAndHandling,
					default: true
				}
			],
			available_tax_rates: taxRates.map((elem) => {
				const { _links, ...rest } = elem

				return rest
			})
		}
	}

	async getCustomerAddress(
		WooCommerce: WooCommerceRestApi,
		customerId: number
	): Promise<TaxLocation> {
		const addressReq = WooCommerce.get(`customers/${customerId}`)

		const [err, res] = await this.utilsService.asyncWrapper(addressReq)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}

		const { postcode, city, state, country } = res?.data?.shipping

		if (!postcode || !city || !state || !country) {
			const message = "Customer Shipping Address is Empty"

			const code = "address_empty"

			throw new CustomException({ message, code }, 400)
		}

		return { postcode, city, state_code: state, country_code: country }
	}

	// TODO: This has been moved to ProductsService. Need a refactor
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

		const { product, productId, variantId, qty } = value

		const { stock_quantity, regular_price, sale_price, price, tax_status, tax_class } = product

		if (!stock_quantity) {
			return {
				error: true,
				product_id: productId,
				variant_id: variantId,
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
			qty,
			tax_status,
			tax_class
		}
	}

	async getTaxRates(WooCommerce: WooCommerceRestApi, location: TaxLocation): Promise<any> {
		const { postcode, city, state_code, country_code } = location

		const taxRatesReq = WooCommerce.get("taxes", { per_page: 100 })

		const [taxRatesErr, taxRatesResp] = await this.utilsService.asyncWrapper(taxRatesReq)

		if (taxRatesErr) {
			const { status, data } = taxRatesErr.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}

		const taxRates = taxRatesResp.data.filter((tax: any) => {
			const { country, state, postcodes, cities } = tax

			/* The WooCommerce Tax Calculation takes precendence in following order,
			postcode > city > state > country */

			/* If a tax rate contains postcode, the tax rate should be applicable only 
			if the address contains the same postcode, otherwise it should be ignored */
			if (postcodes.length > 0) return postcodes.includes(postcode)

			/* If a tax rate contains city, the tax rate should be applicable only 
			if the address contains the same city, otherwise it should be ignored */
			if (cities.length > 0) return cities.includes(city)

			/* A tax rate can be applicable to all states of the country, in that case
			WooCommerce stores the state values as empty string, so if state doesn't have 
			any value we should check whether the address contains same country 
			code as tax rate, else the rate should be ignored */
			if (!state) return country === country_code

			/* If a tax rate has value for state & country, then the address should be same
			as tax rate, otherwise it should be ignored */
			return country === country_code && state === state_code
		})

		return taxRates
	}

	getProductTax(
		product: any,
		taxRates: any[],
		roundAtSubtotal: boolean,
		taxDisplaySuffix: string
	) {
		const { tax_class: prodTaxClass, tax_status, price, qty, ...restProduct } = product

		const { compRate, nonCompRate } = this.splitCompAndNonCompTaxRates(prodTaxClass, taxRates)

		const nonCompoundTax = this.getNonCompTax(nonCompRate, price)

		const subTotal = nonCompoundTax["total"] + price

		const compoundTax = this.getCompTax(compRate, subTotal)

		const productTotalTax = nonCompoundTax["total"] + compoundTax["total"]

		const roundTotalTax = roundAtSubtotal ? productTotalTax : Math.round(productTotalTax)

		const compAndNonCompArr = [
			...Object.entries(nonCompoundTax),
			...Object.entries(compoundTax)
		]

		const taxValueWithName = compAndNonCompArr.reduce((acc: any, taxValue: any) => {
			const [key, value] = taxValue

			if (key === "total") return acc

			const keyInAcc = acc[key]

			const roundTax = roundAtSubtotal ? value["tax_value"] : Math.round(value["tax_value"])

			if (keyInAcc) return (acc[key] += roundTax)

			acc[key] = roundTax

			return acc
		}, {})

		return {
			...restProduct,
			price,
			qty,
			total_sale_price: price * qty,
			tax_value: roundTotalTax,
			total_tax_value: roundTotalTax * qty,
			tax_label: taxDisplaySuffix,
			tax_class: prodTaxClass,
			tax_status,
			tax_value_with_name: taxValueWithName,
			non_compound_tax: nonCompoundTax,
			compound_tax: compoundTax
		}
	}

	splitCompAndNonCompTaxRates(taxClass: string, taxRates: any[]) {
		return taxRates.reduce(
			(acc: any, taxRate: any) => {
				const { class: taxRateClass, compound } = taxRate

				const isStandard = taxClass === "" && taxRateClass === "standard"

				if (!isStandard && taxClass !== taxRateClass) return acc

				compound ? acc["compRate"].push(taxRate) : acc["nonCompRate"].push(taxRate)

				return acc
			},
			{ compRate: [], nonCompRate: [] }
		)
	}

	getCompTax(taxRates: any[], subTotal: number) {
		const sortRates = taxRates.sort((a, b) => (a.priority > b.priority ? 1 : -1))

		const uniquePriorityRates = this.utilsService.getUniqueObjectsByProp(sortRates, "priority")

		const { subTotal: _, ...compTaxValue } = uniquePriorityRates.reduce(
			(acc: any, taxRate: any) => {
				const { name, rate } = taxRate

				const numberRate = Number(rate)

				const taxValue = (acc["subTotal"] * numberRate) / 100

				acc["total"] += taxValue

				acc["subTotal"] += taxValue

				const taxInAcc = acc[name]

				if (taxInAcc) {
					acc[name] = {
						rate: taxInAcc["rate"] + numberRate,
						tax_value: taxInAcc["tax_value"] + taxValue
					}
				} else {
					acc[name] = { rate: numberRate, tax_value: taxValue }
				}

				return acc
			},
			{ total: 0, subTotal }
		)

		return { ...compTaxValue }
	}

	getNonCompTax(taxRates: any[], price: number) {
		return taxRates.reduce(
			(acc: any, taxRate: any) => {
				const { name, rate } = taxRate

				const numberRate = Number(rate)

				const taxValue = (price * numberRate) / 100

				acc["total"] += taxValue

				const taxInAcc = acc[name]

				if (taxInAcc) {
					acc[name] = {
						rate: taxInAcc["rate"] + numberRate,
						tax_value: taxInAcc["tax_value"] + taxValue
					}
				} else {
					acc[name] = { rate: numberRate, tax_value: taxValue }
				}

				return acc
			},
			{ total: 0 }
		)
	}
	async calculateShipping(body: ShippingDto, req: Request): Promise<ShippingMethod> {
		const { WooCommerce } = req.user as ReqUser
		const { country_code, state_code, postcode, city, method_title_id, sub_total } = body
		const shippingZonesReq = WooCommerce.get(`shipping/zones`)
		const [err, shippingZonesResponse] = await this.utilsService.asyncWrapper(shippingZonesReq)
		if (err) {
			const { status, data } = err.response
			const { code, message } = data
			throw new CustomException({ code, message }, status)
		}
		const [errLocation, responseLocation] = await this.utilsService.asyncWrapper(
			Promise.all(
				shippingZonesResponse.data.map((location) => {
					return WooCommerce.get(`shipping/zones/${location.id}/locations`)
				})
			)
		)
		if (errLocation) {
			const { status, data } = errLocation.response
			const { code, message } = data
			throw new CustomException({ code, message }, status)
		}

		const shippingLocation = responseLocation
			.map((region, index) => {
				const zone_id = shippingZonesResponse.data[index]
				return {
					shipping: region.data,
					location: zone_id
				}
			})
			.reduce((accum, val) => {
				const result = val.shipping.map((el) => ({ ...el, location: val.location }))
				return accum.concat(result)
			}, [])

		let shippingZone

		shippingZone = shippingLocation.find((location) => {
			if (postcode) {
				if (location.type === "postcode" && postcode === location.code) return true
			}
			if (state_code) {
				if (location.type === "state" && `${country_code}:${state_code}` === location.code)
					return true
			}
			if (country_code) {
				if (location.type === "country" && country_code === location.code) return true
			}

			return false
		})

		if (!shippingZone) {
			throw new CustomException(
				{ code: "no_shipping_zone", message: "No shipping zone exist" },
				400
			)
		}
		const locationMethodReq = WooCommerce.get(
			`shipping/zones/${shippingZone.location.id}/methods`
		)
		const [methodError, methodResponse] = await this.utilsService.asyncWrapper(
			locationMethodReq
		)
		if (methodResponse.data.length > 0) {
			let result = methodResponse.data.map((shippingMethod) => {
				return {
					id: shippingMethod.id,
					enabled: shippingMethod.enabled,
					method_id: shippingMethod.method_id,
					method_title: shippingMethod.method_title,
					settings: Object.keys(shippingMethod.settings).reduce((accum, val) => {
						const shipping_settings = shippingMethod.settings[val]
						const obj = {
							label: shipping_settings.label ? shipping_settings.label : "",
							value: shipping_settings.value ? shipping_settings.value : "",
							options: shipping_settings.options ? shipping_settings.options : ""
						}
						accum[val] = obj
						return accum
					}, {})
				}
			})

			const shippingRate = result.map((shipping_method_data) => {
				if (shipping_method_data.id == method_title_id) {
					if (shipping_method_data.method_id === "free_shipping") {
						if (sub_total > parseInt(shipping_method_data.settings.min_amount.value)) {
							result = [
								...result,
								{ shippingCalculation: "Eligible for free shipping" }
							]
						} else {
							result = [
								...result,
								{ shippingCalculation: "Not eligible for free shipping" }
							]
						}
					} else if (shipping_method_data.method_id === "local_pickup") {
						result = [
							...result,
							{
								shippingCalculation:
									sub_total +
									parseInt(
										shipping_method_data.settings.cost.value == ""
											? shipping_method_data.settings.cost.value
											: "0"
									)
							}
						]
					}
				} else {
					if (
						!JSON.stringify(result).includes(
							"This shipping method don't exist for this location."
						)
					) {
						result = [
							...result,
							{ error: "This shipping method don't exist for this location." }
						]
					}
				}
			})
			return result
		}
	}
}
