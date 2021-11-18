import { IsNumber } from "class-validator"

export class WishlistDto {
	@IsNumber()
	customer_id: number

	@IsNumber()
	product_id: number

	@IsNumber()
	variant_id: number
}
