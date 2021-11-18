import { IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class SearchProductsDto {
	@IsOptional()
	search_key?: string

	@IsOptional()
	@Type(() => Number)
	per_page?: number

	@IsOptional()
	@Type(() => Number)
	page_no?: number

	@IsOptional()
	sort?: string
}
