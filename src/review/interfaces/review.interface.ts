//Response params after creating a review for product
export interface ReviewMessageT {
	product_id: number
	review_id: number
	status: string
}

//Response params to fetch a review/all review
export interface ReviewT {
	review_id: number
	reviewer: String
	reviewer_email: String
	review: String
	rating: number
	reviewer_avatar_urls: String
	date_created_gmt: String
}

export interface ReviewDetailT {
	product_id: number
	reviews: ReviewT[]
}

//Response Params for updating Review

export interface UpdateReviewT {
	product_id: number
	reviewer: string
	reviewer_email: string
	review: string
	rating: number
}
export interface UpdateReviewAuthorizationT {
	authorized:boolean
	message:string
}
export interface ErrorT {
	error:string
}

export interface DeleteReviewT {
	is_deleted: boolean
	product_id: number
	review_id: number
	reviewer: string
	reviewer_email: string
	review: string
	rating: number
}
