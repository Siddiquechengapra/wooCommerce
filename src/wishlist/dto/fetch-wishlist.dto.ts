import { Type } from "class-transformer"
import { IsNumber } from "class-validator"

export class FetchWishlistDto {
	@Type(() => Number)
	@IsNumber()
	customer_id: number
}
