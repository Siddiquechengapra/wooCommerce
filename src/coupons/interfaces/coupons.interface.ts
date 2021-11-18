export interface CouponsT {
	id: number
	code: string
	amount: string
	discount_type: string
	description: string
	date_expires_gmt: string
	usage_count: number
	individual_use: boolean
	product_ids: string[]
	excluded_product_ids: string[]
	usage_limit: number
	usage_limit_per_user: number
	limit_usage_to_x_items: number
	free_shipping: boolean
	product_categories: string[]
	excluded_product_categories: string[]
	exclude_sale_items: boolean
	minimum_amount: string
	maximum_amount: string
	email_restrictions: string[]
	used_by: string[]
}
