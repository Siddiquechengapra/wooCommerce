import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { Transform, Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class AllOrdersDto {
	@IsNotEmpty()
	@Type(() => Number)
	customer_id: number

	@IsOptional()
	order_status?: string

	@IsOptional()
	@Type(() => Number)
	page_no?: number

	@IsOptional()
	@Type(() => Number)
	per_page?: number

	@IsOptional()
	sort?: string

	@IsOptional()
	sort_by?: string

	@ApiProperty({ type: [Number], format: "form" })
	@IsOptional()
	@Transform(({ value }) => value.split(",").map((v: string) => parseInt(v.trim())))
	@IsNumber({}, { each: true })
	orders?: number[]

	@IsOptional()
	@IsDateString()
	from?: Date

	@IsOptional()
	@IsDateString()
	to?: Date
}
