import {
	Controller,
	Get,
	Query,
	UseGuards,
	Param,
	Post,
	Body,
	Put,
	Delete,
	Req
} from "@nestjs/common"
import { ReviewService } from "./review.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import {
	ReviewDetailT,
	ReviewMessageT,
	UpdateReviewT,
	DeleteReviewT,
	UpdateReviewAuthorizationT,
	ErrorT
} from "./interfaces/review.interface"

import { PostReviewDetailDto, AllReviewDto, UpdateReviewDetailDto,DeleteReviewDto } from "./dto/review.dto"

import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiBearerAuth,
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
	ApiGoneResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger"
import { Request } from "express"

@ApiTags("Reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reviews")
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get("")
	@ApiOperation({ summary: "Retrieve a review" })
	@ApiOkResponse({ description: "To fetch a reviews of the product" })
	@ApiNotFoundResponse({ description: "No review is found" })
	@ApiOperation({ summary: "Retrieve all reviews" })
	@ApiOkResponse({ description: "To fetch all reviews of the product" })
	async allReviewDetails(
		@Query() query: AllReviewDto,
		@Req() req: Request
	): Promise<ReviewDetailT> {
		return await this.reviewService.getAllReview(query, req)
	}

	@Post("")
	@ApiOperation({ summary: "create review" })
	@ApiOkResponse({ description: "Review is created" })
	@ApiBadRequestResponse({
		description: "Bad Request. Invalid input data.Please verify request body"
	})
	async addReview(
		@Body() body: PostReviewDetailDto,
		@Req() req: Request
	): Promise<ReviewMessageT> {
		return await this.reviewService.addReview(body, req)
	}

	@Get(":review_id")
	@ApiOperation({ summary: "Retrieve a review" })
	@ApiOkResponse({ description: "To fetch a reviews of the product" })
	@ApiNotFoundResponse({ description: "Given Review id/StoreId is not found" })
	async reviewDetail(
		@Param("review_id") review_id: number,
		@Req() req: Request
	): Promise<ReviewDetailT> {
		return await this.reviewService.getReview(review_id, req)
	}

	@Put(":review_id")
	@ApiOperation({ summary: "Update review" })
	@ApiOkResponse({ description: "The review updated successfully" })
	@ApiForbiddenResponse({ description: "Forbidden Access denied" })
	@ApiNotFoundResponse({ description: "Given Review id/StoreId is not found" })
	@ApiBadRequestResponse({ description: "Bad Request Invalid review Content" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async update(
		@Body() body: UpdateReviewDetailDto,

		@Param("review_id") review_id: number,
		@Req() req: Request
	): Promise<UpdateReviewT|UpdateReviewAuthorizationT|ErrorT> {
		return await this.reviewService.updateReview(body, review_id, req)
	}

	@Delete(":review_id")
	@ApiOperation({ summary: "Delete review" })
	@ApiOkResponse({ description: "The review is deleted successfully" })
	@ApiGoneResponse({ description: "The object has already been trashed" })
	@ApiNotFoundResponse({ description: "Given Review id/StoreId is not found" })
	@ApiForbiddenResponse({ description: "Forbidden Access denied" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async delete(
		@Req() req: Request,
		@Query() query: DeleteReviewDto,
	): Promise<DeleteReviewT|UpdateReviewAuthorizationT |ErrorT> {
		return await this.reviewService.deleteReview(query, req)
	}
}
