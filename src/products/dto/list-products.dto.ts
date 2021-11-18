import { IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class ListProductsDto {
	@IsOptional()
	@Type(() => Number)
	collection_id?: number

	@IsOptional()
	slug?: string

	@IsOptional()
	name?: string
	@IsOptional()
	@Type(() => Number)
	per_page?: number

	@IsOptional()
	@Type(() => Number)
	page_no?: number

	@IsOptional()
	sort?: string
}
