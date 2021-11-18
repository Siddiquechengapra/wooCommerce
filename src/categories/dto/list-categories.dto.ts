import { IsNotEmpty, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class catDto {
	@IsNotEmpty()
	category_id?: string
	@IsOptional()
	parent?: number
	@IsOptional()
	per_page?: number
	@IsOptional()
	orderby?: string
}