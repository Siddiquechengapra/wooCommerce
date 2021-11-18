export interface Media {
	media_id: number
	media_url: string
}

export interface SearchedProduct {
	product_id: number
	product_name: string
	regular_price: number
	sale_price: number
	inventory_quantity: number
	discount_percentage: string
	media: Media
}

export interface SearchProductResponse {
	product_list: SearchedProduct[]
	current_page_no: number
}
