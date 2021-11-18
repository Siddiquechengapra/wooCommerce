import { Injectable, HttpException } from "@nestjs/common"

import { UtilsService } from "src/utils/utils.service"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { Request } from "express"

import {
	ReviewT,
	ReviewDetailT,
	ReviewMessageT,
	UpdateReviewT,
	DeleteReviewT,
	UpdateReviewAuthorizationT,
	ErrorT
} from "./interfaces/review.interface"
import {
	PostReviewDetailDto,
	AllReviewDto,
	UpdateReviewDetailDto,
	DeleteReviewDto
} from "./dto/review.dto"

@Injectable()
export class ReviewService {
	constructor(private utilsService: UtilsService) {}
	async getReview(review_id, req: Request): Promise<ReviewDetailT> {
		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.get(`products/reviews/${review_id}`)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const reviewDetail: ReviewT = {
			review_id: response.data.id,
			reviewer: response.data.reviewer,
			reviewer_email: response.data.reviewer_email,
			review: response.data.review,
			rating: response.data.rating,
			reviewer_avatar_urls: response.data.reviewer_avatar_urls,
			date_created_gmt: response.data.date_created_gmt
		}
		return {
			product_id: response.data.product_id,
			reviews: [reviewDetail]
		}
	}
	async addReview(body: PostReviewDetailDto, req: Request): Promise<ReviewMessageT> {
		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.post("products/reviews", body)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const postReview = {
			product_id: response.data.product_id,
			review_id: response.data.id,
			status: "A review is created"
		}
		return postReview
	}

	async getAllReview(query: AllReviewDto, req: Request): Promise<ReviewDetailT> {
		const { product_id, page_no = 1, per_page = 10, sort = "desc" } = query
		const { WooCommerce } = req.user as ReqUser

		const params = {
			product: product_id,
			page: page_no,
			per_page: per_page,
			order: sort
		}
		const options = JSON.parse(JSON.stringify(params))

		const request = WooCommerce.get(`products/reviews`, options)
		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const reviewData = response.data.map((r) => ({
			review_id: r.id,
			reviewer: r.reviewer,
			reviewer_email: r.reviewer_email,
			review: r.review,
			rating: r.rating,
			reviewer_avatar_urls: r.reviewer_avatar_urls,
			date_created_gmt: r.date_created_gmt
		}))

		return {
			product_id: query.product_id,
			reviews: reviewData
		}
	}

	async updateReview(
		body: UpdateReviewDetailDto,
		review_id,
		req: Request
	): Promise<UpdateReviewT | UpdateReviewAuthorizationT | ErrorT> {
		const { WooCommerce } = req.user as ReqUser
		const customerData = await WooCommerce.get(`customers/${body.customer_id}`)
		if (!customerData) {
			return {
				error: `Customer not found of id ${body.customer_id}`
			}
		}
		if (body.email === customerData.data.email) {
			const request = WooCommerce.put(`products/reviews/${review_id}`, body)
			const [err, response] = await this.utilsService.asyncWrapper(request)

			if (err) {
				const { status, data } = err.response

				const { code, message } = data

				throw new HttpException({ message, code }, status)
			}

			const updateReview = {
				product_id: response.data.id,
				reviewer: response.data.reviewer,
				reviewer_email: response.data.reviewer_email,
				review: response.data.review,
				rating: response.data.rating
			}
			return updateReview
		} else {
			return { authorized: false, message: "you are not authorized to update this review" }
		}
	}

	async deleteReview(
		query: DeleteReviewDto,
		req: Request
	): Promise<DeleteReviewT | UpdateReviewAuthorizationT | ErrorT> {
		const { WooCommerce } = req.user as ReqUser
		const { customer_id, review_id, email } = query

		const customerData = await WooCommerce.get(`customers/${customer_id}`)
		if (!customerData) {
			return {
				error: `Customer not found of id ${customer_id}`
			}
		}
		if (email === customerData.data.email) {
			const request = WooCommerce.delete(`products/reviews/${review_id}`)
			const [err, response] = await this.utilsService.asyncWrapper(request)

			if (err) {
				const { status, data } = err.response

				const { code, message } = data

				throw new HttpException({ message, code }, status)
			}
			const deleteReview = {
				is_deleted: true,
				product_id: response.data.product_id,
				review_id: response.data.id,
				reviewer: response.data.reviewer,
				reviewer_email: response.data.reviewer_email,
				review: response.data.review,
				rating: response.data.rating
			}
			return deleteReview
		} else {
			return { authorized: false, message: "you are not authorized to delete this review" }
		}
	}
}
