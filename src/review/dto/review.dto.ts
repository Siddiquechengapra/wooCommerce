import { IsNotEmpty, IsOptional } from "class-validator"
import { Type } from "class-transformer"

//Request body to create a review
export class PostReviewDetailDto {
	@IsNotEmpty()
	customer_id: number

	@IsNotEmpty()
	product_id: number

	@IsNotEmpty()
	reviewer: string

	@IsNotEmpty()
	reviewer_email: string

	@IsNotEmpty()
	review: string

	@IsNotEmpty()
	rating: number
}

//Request parameter to fetch all review
export class AllReviewDto {
	product_id: number

	@Type(() => Number)
	page_no?: number

	@IsOptional()
	@Type(() => Number)
	per_page?: number

	@IsOptional()
	sort?: string
}
export class DeleteReviewDto {
	@IsNotEmpty()
	customer_id: number
	email:string
	review_id: number
}

//Request body to update review

export class UpdateReviewDetailDto {
	@IsNotEmpty()
	customer_id: number
	email:string
	reviewer: string
	review: string
	rating: number
}
