import { IsNotEmpty, IsNumber } from "class-validator"
import { Type } from "class-transformer"

export class StateListDto {
	@IsNotEmpty()
	country_id: string
}
