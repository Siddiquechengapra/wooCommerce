export interface Media {
	media_id: number
	media_url: string
}

export interface VajroProduct {
	product_id: number
	product_name: string
	regular_price: string
	sale_price: string
	inventory_quantity: number
	discount_percentage: string
	media: Media
}

export interface ProductsResponse {
	product_list: VajroProduct[]
	current_page_no: number
}
