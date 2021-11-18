import { AllOrders, CreateOrder, UpdateOrder, CancelOrder } from "./interfaces/orders.interfaces"
import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { UtilsService } from "src/utils/utils.service"
import { AllOrdersDto } from "./dto/all-orders.dto"
import { CustDto } from "./dto/orders.dto"
import { VajroLineItems, VajroOrder } from "./interfaces/vajro-order.interface"
import { subMonths } from "date-fns"
import { Request } from "express"
import { CustomException } from "src/custom-exception"

@Injectable()
export class OrdersService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async getAllOrder(query: AllOrdersDto, req: Request): Promise<AllOrders> {
		const { WooCommerce } = req.user as ReqUser

		let {
			customer_id,
			order_status = "any",
			page_no,
			per_page = 20,
			sort,
			sort_by,
			orders,
			from = subMonths(new Date(), 12).toISOString(),
			to
		} = query
		if (order_status === "upcoming") {
			order_status = "pending,processing,on-hold"
		}
		if (order_status === "previous") {
			order_status = "completed,cancelled,refunded,failed,trash"
		}

		const params = {
			customer: customer_id,
			status: order_status.split(","),
			page: page_no,
			per_page,
			order: sort,
			orderby: sort_by,
			include: orders,
			after: from,
			before: to
		}

		const options = JSON.parse(JSON.stringify(params))
		const ordersReq = WooCommerce.get("orders", options)

		const [err, response] = await this.utilsService.asyncWrapper(ordersReq)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const orderResponse = response.data.map(this.vajroOrder)

		const allOrders = orderResponse.map((order) => {
			return {
				order_id: order.order_id ? order.order_id : null,
				order_status: order.order_status,
				order_total: order.order_purchase_total,
				currency_code: order.currency_code,
				date_created_gmt: order.date_created_gmt,
				date_modified_gmt: order.date_modified_gmt
			}
		})

		return {
			orders: allOrders
		}
	}

	async getOrder(order_id: number, req: Request, query: CustDto): Promise<VajroOrder> {
		const { WooCommerce } = req.user as ReqUser

		const { customer_id } = query

		const params = {
			customer: parseInt(customer_id),
			include: [order_id]
		}

		const orderReq = WooCommerce.get(`orders`, params)

		const [orderErr, orderResp] = await this.utilsService.asyncWrapper(orderReq)

		if (orderErr) {
			const { status, data } = orderErr.response

			const { code, message } = data

			throw new HttpException({ status: status, error: { code, message } }, status)
		} else if (orderResp.data.length === 0) {
			const message = "Invalid Order ID or Customer ID"

			const code = "could_not_fetch_order"

			const status = 422
			throw new HttpException({ message, code }, status)
		}

		const order = this.vajroOrder(orderResp.data[0])

		let lineItems = order.line_items

		const productVariantReq = Promise.all(
			lineItems
				.filter((lineItem) => lineItem.variant_id !== null)
				.map((lineItem) => {
					return WooCommerce.get(
						`products/${lineItem.product_id}/variations/${lineItem.variant_id}`
					)
				})
		)

		const [productVariantErr, productVariantResp] = await this.utilsService.asyncWrapper(
			productVariantReq
		)

		if (productVariantErr) {
			const { status, data } = productVariantErr.response

			const { code, message } = data

			throw new HttpException({ status: status, error: { code, message } }, status)
		}

		lineItems = lineItems.map((lineItem) => {
			const variant = productVariantResp.find((res) => res.data.id === lineItem.variant_id)

			if (variant == undefined) {
				return lineItem
			}

			return {
				...lineItem,
				image_url: variant.data.image.src,
				image_alt_text: variant.data.image.alt,
				variant_attributes: variant.data.attributes.map((attr) => ({
					name: attr.name,
					value: attr.option
				}))
			}
		})

		order.line_items = lineItems

		if (lineItems.find((data) => data.variant_id === null) == undefined) {
			return order
		}

		const productsReq = Promise.all(
			lineItems
				.filter((data) => data.variant_id === null)
				.map((lineItem) => {
					return WooCommerce.get(`products/${lineItem.product_id}`)
				})
		)

		const [productsErr, productsResp] = await this.utilsService.asyncWrapper(productsReq)

		if (productsErr) {
			const { status, data } = productsErr.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		lineItems = lineItems.map((data) => {
			if (data.variant_id === null) {
				const imgs = productsResp
					.map((product: any) => product.data)
					.filter((product) => product.id === data.product_id)
					.reduce((accum, val) => {
						return {
							image_url: val.images.length > 0 ? val.images[0].src : "",
							image_alt_text: val.images.length > 0 ? val.images[0].alt : "",
							variant_attributes: []
						}
					}, null)
				return {
					...data,
					image_url: imgs.image_url,
					image_alt_text: imgs.image_alt_text,
					variant_attributes: imgs.variant_attributes
				}
			}
			return data
		})

		order.line_items = lineItems

		return order
	}

	vajroOrder(order: any): VajroOrder {
		const lineItems = order.line_items.map((lineItem: any): VajroLineItems => {
			return {
				line_item_id: lineItem.id ? lineItem.id : null,
				product_name: lineItem.name,
				product_id: lineItem.product_id ? lineItem.product_id : null,
				variant_id: lineItem.variation_id ? lineItem.variation_id : null,
				quantity: lineItem.quantity ? lineItem.quantity : null,
				price: lineItem.price ? lineItem.price : null,
				image_url: "",
				image_alt_text: "",
				variant_attributes: []
			}
		})
		const shipping = {
			first_name: order.shipping.first_name,
			last_name: order.shipping.last_name,
			address_1: order.shipping.address_1,
			address_2: order.shipping.address_2,
			city: order.shipping.city,
			state: order.shipping.state,
			postal_code: order.shipping.postal_code,
			country: order.shipping.country,
			phone: order.billing.phone
		}
		const billing = {
			first_name: order.billing.first_name,
			last_name: order.billing.last_name,
			address_1: order.billing.address_1,
			address_2: order.billing.address_2,
			city: order.billing.city,
			state: order.billing.state,
			postal_code: order.billing.postal_code,
			country: order.billing.country,
			phone: order.billing.phone
		}

		return {
			order_id: order.id ? order.id : null,
			order_status: order.status,
			order_purchase_total: order.total,
			order_price_total: (
				parseInt(order.total) +
				parseInt(order.discount_total) -
				(parseInt(order.total_tax) + parseInt(order.shipping_total))
			).toString(),

			shipping_total: order.shipping_total,
			total_tax: order.total_tax,
			discount_total: order.discount_total,
			currency_code: order.currency,
			date_created_gmt: order.date_created_gmt,
			date_modified_gmt: order.date_modified_gmt,
			line_items_count: order.line_items.length ? order.line_items.length : null,
			payment_method_title: order.payment_method_title,
			prices_include_tax: order.prices_include_tax,
			line_items: lineItems,
			shipping_details: shipping,
			billing_details: billing
		}
	}

	async createOrder(body: CreateOrderDto, req: Request): Promise<CreateOrder> {
		const { WooCommerce } = req.user as ReqUser

		const {
			customer_id,
			order_grand_total,
			currency_code,
			order_note,
			payment_method_id,
			payment_method_label,
			shipping_method_id,
			shipping_method_label,
			shipping_method_value,
			discount_id,
			discount_label,
			discount_value,
			tax_label,
			tax_value,
			products,
			shipping_address,
			billing_address
		} = body

		const set_paid = false

		const shippingLines = [
			{
				method_id: shipping_method_id,
				method_title: shipping_method_label,
				total: shipping_method_value.toString()
			}
		]

		const lineItems = products.map((product: any) => {
			const lineItem = {
				product_name: product.product_name,
				product_id: product.product_id,
				meta_data: [{ key: "option_string", value: product.option_string }],
				quantity: product.quantity,
				price: product.price,
				total_tax: `${product.tax_label}||${product.tax_value}`
			}
			product.variant_id && (lineItem["variation_id"] = product.variant_id)
			return lineItem
		})

		const data = {
			customer_id: parseInt(customer_id),
			set_paid,
			total: order_grand_total,
			payment_method: payment_method_id,
			payment_method_title: payment_method_label,
			customer_note: order_note,
			currency: currency_code,
			total_tax: tax_value,
			line_items: lineItems,
			shipping_lines: shippingLines,
			discount_total: discount_value,
			billing: {
				first_name: billing_address.first_name,
				last_name: billing_address.last_name,
				address_1: billing_address.address_1,
				address_2: billing_address.address_2,
				city: billing_address.city,
				state: billing_address.state,
				country: billing_address.country,
				postcode: billing_address.zip,
				email: billing_address.email,
				phone: billing_address.phone
			},
			shipping: {
				first_name: shipping_address.first_name,
				last_name: shipping_address.last_name,
				address_1: shipping_address.address_1,
				address_2: shipping_address.address_2,
				city: shipping_address.city,
				state: shipping_address.state,
				country: shipping_address.country,
				postcode: shipping_address.zip
			}
		}
		const orderReq = WooCommerce.post("orders", data)

		const [err, response] = await this.utilsService.asyncWrapper(orderReq)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		return {
			customer_id: response.data.customer_id,
			order_id: response.data.id,
			order_status: response.data.status
		}
	}
	async updateOrder(body: UpdateOrderDto, req: Request): Promise<UpdateOrder> {
		const { WooCommerce } = req.user as ReqUser

		const {
			customer_id,
			order_id,
			order_status,
			set_paid,
			order_grand_total,
			currency_code,
			order_note,
			payment_method_id,
			payment_method_label,
			shipping_method_id,
			shipping_method_label,
			shipping_method_value,
			// discount_id,
			// discount_label,
			discount_value,
			// tax_label,
			// tax_value,
			products,
			shipping_address,
			billing_address
		} = body

		// const taxLines = {
		// 	label: tax_label,
		// 	tax_total: tax_value
		// }

		const orderDetails = WooCommerce.get(`orders/${order_id}`)

		const [orderError, orderRes] = await this.utilsService.asyncWrapper(orderDetails)

		if (orderError) {
			const { status, data } = orderError.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}
		if (orderRes.data.customer_id !== parseInt(customer_id)) {
			const message = "Invalid Order ID or Customer ID"

			const code = "invalid_request"

			const status = 400

			throw new CustomException({ message, code }, status)
		}
		if (orderRes.data.status === "completed") {
			const message = "Order is already completed"

			const code = "invalid_request"

			const status = 400

			throw new CustomException({ message, code }, status)
		}

		const shippingLine = orderRes.data.shipping_lines.filter(
			(item) => item.method_id === shipping_method_id
		)

		const shipping_lines = [
			{
				id: shippingLine[0].id,
				method_id: shipping_method_id,
				method_title: shipping_method_label,
				total: shipping_method_value.toString()
			}
		]
		let lineItemIdMap = new Map()
		let metaDataIdMap = new Map()
		orderRes.data.line_items.map((item) => {
			{
				lineItemIdMap.set(`${item.product_id}_${item.variation_id}`, item.id),
					metaDataIdMap.set(
						`${item.product_id}_${item.variation_id}`,
						item.meta_data[0].id
					)
			}
		})

		const lineItems = products.map((item) => {
			const lineItemId = lineItemIdMap.get(`${item.product_id}_${item.variant_id}`)
			const metaDataId = metaDataIdMap.get(`${item.product_id}_${item.variant_id}`)
			if (lineItemId) {
				return {
					id: lineItemId,
					product_id: item.product_id,
					variation_id: item.variant_id,
					quantity: item.quantity,
					price: item.price,
					meta_data: [
						{
							id: metaDataId,
							key: "option_string",
							value: item.option_string
						}
					],
					total_tax: `${item.tax_label}||${item.tax_value}`
				}
			}
			return {
				product_id: item.product_id,
				variation_id: item.variant_id,
				quantity: item.quantity,
				price: item.price,
				meta_data: [
					{
						key: "option_string",
						value: item.option_string
					}
				],
				total_tax: `${item.tax_label}||${item.tax_value}`
			}
		})

		const data = {
			set_paid,
			order_status,
			total: order_grand_total,
			payment_method: payment_method_id,
			payment_method_title: payment_method_label,
			customer_note: order_note,
			currency: currency_code,
			// tax_lines: taxLines,
			line_items: lineItems,
			shipping_lines: shipping_lines,
			discount_total: discount_value,
			shipping: {
				first_name: shipping_address.first_name,
				last_name: shipping_address.last_name,
				address_1: shipping_address.address_1,
				address_2: shipping_address.address_2,
				city: shipping_address.city,
				state: shipping_address.state,
				country: shipping_address.country,
				email: shipping_address.email,
				phone: shipping_address.phone,
				postcode: shipping_address.zip
			},
			billing: {
				first_name: billing_address.first_name,
				last_name: billing_address.last_name,
				address_1: billing_address.address_1,
				address_2: billing_address.address_2,
				city: billing_address.city,
				state: billing_address.state,
				country: billing_address.country,
				email: billing_address.email,
				postcode: billing_address.zip
			}
		}
		const orderReq = WooCommerce.put(`orders/${order_id}`, data)

		const [updateErr, updateRes] = await this.utilsService.asyncWrapper(orderReq)

		if (updateErr) {
			const { status, data } = updateErr.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}

		return {
			order_id: updateRes.data.id,
			status: updateRes.data.status,
			message: "Order updated successfully"
		}
	}

	async cancelOrder(order_id: number, req: Request, query: CustDto): Promise<CancelOrder> {
		const { WooCommerce } = req.user as ReqUser

		const { customer_id } = query

		const params = {
			customer: parseInt(customer_id),
			include: [order_id]
		}

		const orderReq = WooCommerce.get(`orders`, params)

		const [orderErr, orderResp] = await this.utilsService.asyncWrapper(orderReq)

		if (orderErr) {
			const { status, data } = orderErr.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		} else if (orderResp.data.length === 0) {
			const message = "Invalid Details"

			const code = "could_not_fetch_order"

			const status = 422

			throw new CustomException({ message, code }, status)
		}

		const order = this.vajroOrder(orderResp.data[0])

		if (order.order_id === order_id) {
			const data = { status: "cancelled" }

			const request = WooCommerce.put(`orders/${order_id}`, data)

			const [err, response] = await this.utilsService.asyncWrapper(request)

			if (err) {
				const { status, data } = err.response

				const { code, message } = data

				throw new CustomException({ message, code }, status)
			}

			return {
				order_id: response.data.id,
				message: "Order Cancelled Successfully"
			}
		} else {
			const message = "Invalid Details"

			const code = "could_not_cancel_order"

			const status = 400
			throw new CustomException({ message, code }, status)
		}
	}
}
