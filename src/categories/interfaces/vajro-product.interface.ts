export interface Media {
	id: number
	src: string
	alt: string
}

export interface VajroProduct {
	product_id: number
	product_name: string
	product_brand: string
	price: string
	regular_price: string
	sale_price: string
	product_type: string
	featured: Boolean
	on_sale: Boolean
	purchasable: Boolean
	virtual: Boolean
	downloadable: Boolean
	average_rating: string
	rating_count: number
	price_html: string
	inventory_quantity:number
	tags:string[]
	images: Media
}

export interface ProductsResponse {
	product_list: VajroProduct[]
	current_page_no: number
}