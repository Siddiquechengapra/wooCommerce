export interface VajroOrder {
	order_id: number
	order_status: String
	order_purchase_total: string
	order_price_total:string
	shipping_total:string
	total_tax:string
	discount_total:string
	currency_code: string
	date_created_gmt: string
	date_modified_gmt: string
	line_items_count: number
	payment_method_title:string
	prices_include_tax:boolean
	
	line_items: VajroLineItems[]
	shipping_details:VajroShippingDetails
	billing_details:VajroBillingDetails,

	
}

export interface VajroLineItems {
	line_item_id: number
	product_name: string
	product_id: number
	variant_id: number
	quantity: number
	price: number
	image_url:string
	image_alt_text:string
	variant_attributes:VajroVariantAttributes[]
}

export interface VajroVariantAttributes{
	name:string
	value:string
}


export interface VajroShippingDetails {
	first_name: string
	last_name: string
	address_1: string
	address_2: string
	city: string
	state: string
	postal_code: string
	country: string

}
export interface VajroBillingDetails {
	first_name: string
	last_name: string
	address_1: string
	address_2: string
	city: string
	state: string
	postal_code: string
	country: string
	phone: string
}