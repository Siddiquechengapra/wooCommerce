export interface ProductMedia {
	url: string
	media_id: string
}

export interface ProductVariant {
	id: string
	product_id: string
	variant_name: string
	attributes: string[]
	regular_price: number
	sale_price: number
	discount_percentage: string
	inventory_quantity: number
	media_id: string
}

export interface ProductDimension {
	length: number
	width: number
	height: number
}
export interface filteredAttributes {
	name: string
	options: string[]
}
export interface ProductCollection {
	id: string
	name: string
	slug: string
}

export interface ProductAttributes {
	id: string
	name: string
	position: number
	visible: boolean
	variation: boolean
	options: string[]
}

export interface ProductTags {
	id: string
	name: string
	slug: string
}

export interface Product {
	product_id: string
	product_name: string
	product_sku: string
	product_brand: string
	slug: string
	permalink: string
	description: string
	short_description: string
	price: number
	regular_price: number
	sale_price: number
	price_range: number[]
	inventory_quantity: number
	product_type: string
	date_on_sale_from_gmt: string
	date_on_sale_to_gmt: string
	on_sale: boolean
	purchasable: boolean
	virtual: boolean
	downloadable: boolean
	shipping_required: boolean
	shipping_taxable: boolean
	shipping_class: string
	shipping_class_id: number
	tax_class: string
	reviews_allowed: boolean
	average_rating: number
	rating_count: number
	grouped_products: number[]
	weight: number
	dimensions: ProductDimension
	product_attributes: ProductAttributes[]
	created_at: string
	updated_at: string
	tags: string[]
	images: ProductMedia[]
	variants: ProductVariant[]
	currency: string
	discount_percentage: string
}

export interface Discount {
	percent: string
	value: number
}
