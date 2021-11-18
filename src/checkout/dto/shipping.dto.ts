import { IsString, IsNumber } from "class-validator"

export class ShippingDto {
	@IsString()
	country_code: string

	@IsString()
	state_code: string

	@IsString()
	postcode: string

	@IsString()
	city: string

	@IsNumber()
	method_title_id: number

	@IsNumber()
	sub_total: number
}
