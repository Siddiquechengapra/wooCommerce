import { Injectable, HttpException } from "@nestjs/common"
import { UtilsService } from "src/utils/utils.service"
import { Request } from "express"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { CouponsT } from "./interfaces/coupons.interface"

@Injectable()
export class CouponsService {
	constructor(private utilsService: UtilsService) {}
	async findCoupons(req: Request): Promise<CouponsT> {
		const { WooCommerce } = req.user as ReqUser
		const request = WooCommerce.get(`coupons`)
		const [err, response] = await this.utilsService.asyncWrapper(request)
		if (err) {
			const { status, data } = err.response
			const { code, message } = data
			throw new HttpException({ message, code }, status)
		}
		const couponlist: CouponsT = response.data.map((item) => ({
			id: item.id,
			code: item.code,
			amount: item.amount,
			discount_type: item.discount_type,
			description: item.description,
			date_expires_gmt: item.date_expires_gmt,
			usage_count: item.usage_count,
			individual_use: item.individual_use,
			product_ids: item.product_ids,
			excluded_product_ids: item.excluded_product_ids,
			usage_limit: item.usage_limit,
			usage_limit_per_user: item.usage_limit_per_user,
			limit_usage_to_x_items: item.limit_usage_to_x_items,
			free_shipping: item.free_shipping,
			product_categories: item.product_categories,
			excluded_product_categories: item.excluded_product_categories,
			exclude_sale_items: item.exclude_sale_items,
			minimum_amount: item.minimum_amount,
			maximum_amount: item.maximum_amount,
			email_restrictions: item.email_restrictions,
			used_by: item.used_by
		}))
		return couponlist
	}

	async findCoupon(req: Request, couponID: number): Promise<CouponsT> {
		const { WooCommerce } = req.user as ReqUser
		const request = WooCommerce.get(`coupons/${couponID}`)
		const [err, response] = await this.utilsService.asyncWrapper(request)
		if (err) {
			const { status, data } = err.response
			const { code, message } = data
			throw new HttpException({ message, code }, status)
		}
		const singleCoupon: CouponsT = {
			id: response.data.id,
			code: response.data.code,
			amount: response.data.amount,
			discount_type: response.data.discount_type,
			description: response.data.description,
			date_expires_gmt: response.data.date_expires_gmt,
			usage_count: response.data.usage_count,
			individual_use: response.data.individual_use,
			product_ids: response.data.product_ids,
			excluded_product_ids: response.data.excluded_product_ids,
			usage_limit: response.data.usage_limit,
			usage_limit_per_user: response.data.usage_limit_per_user,
			limit_usage_to_x_items: response.data.limit_usage_to_x_items,
			free_shipping: response.data.free_shipping,
			product_categories: response.data.product_categories,
			excluded_product_categories: response.data.excluded_product_categories,
			exclude_sale_items: response.data.exclude_sale_items,
			minimum_amount: response.data.minimum_amount,
			maximum_amount: response.data.maximum_amount,
			email_restrictions: response.data.email_restrictions,
			used_by: response.data.used_by
		}
		return singleCoupon
	}
}
