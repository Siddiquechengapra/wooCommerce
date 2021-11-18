export interface RefreshProduct {
	product_id: string
	variant_id: string
	inventory_quantity: number
	regular_price: number
	sale_price: number
}

export interface RefreshCart {
	status: string
	data: RefreshProduct[]
}
