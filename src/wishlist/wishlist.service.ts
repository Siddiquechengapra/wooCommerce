import {
	Injectable,
	Inject,
	forwardRef,
	HttpException,
	NotFoundException,
	HttpStatus
} from "@nestjs/common"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { FetchWishlistDto } from "./dto/fetch-wishlist.dto"
import { UtilsService } from "src/utils/utils.service"
import { WishlistDto } from "./dto/wishlist.dto"
import { Request } from "express"

@Injectable()
export class WishlistService {
	wishlist: any = {}

	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async findAll(query: FetchWishlistDto, req: Request): Promise<any> {
		const { store_id } = req.user as ReqUser

		const { customer_id } = query

		const [storeKey, customerKey] = [`store-${store_id}`, `customer-${customer_id}`]

		if (!this.wishlist[storeKey]) return { wishlisted_products: [] }

		if (!this.wishlist[storeKey][customerKey]) return { wishlisted_products: [] }

		return { wishlisted_products: this.wishlist[storeKey][customerKey] }
	}

	async create(body: WishlistDto, req: Request): Promise<any> {
		const { WooCommerce, store_id } = req.user as ReqUser

		const { customer_id, product_id, variant_id } = body

		const [storeKey, customerKey] = [`store-${store_id}`, `customer-${customer_id}`]

		!this.wishlist[storeKey] && (this.wishlist[storeKey] = {})

		!this.wishlist[storeKey][customerKey] && (this.wishlist[storeKey][customerKey] = [])

		const request = WooCommerce.get(`products/${product_id}`)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const product = response.data

		const images = product.images.map((img: any): any => {
			return {
				image_id: img.id,
				image_url: img.src,
				alt: img.alt
			}
		})

		const data = {
			product_id: product_id,
			variant_id: variant_id,
			pdp_link: product.permalink,
			title: product.name,
			image: images[0]
		}

		this.wishlist[storeKey][customerKey].push(data)

		return {
			message: "Wishlist added successfully",
			status: "Success"
		}
	}

	async delete(body: WishlistDto, req: Request): Promise<any> {
		const { store_id } = req.user as ReqUser

		const { customer_id, product_id, variant_id } = body

		const [storeKey, customerKey] = [`store-${store_id}`, `customer-${customer_id}`]

		if (!this.wishlist[storeKey]) {
			throw new NotFoundException(`Wishlist not found with a Store Id ${store_id} `)
		}

		if (!this.wishlist[storeKey][customerKey]) {
			throw new NotFoundException(`Wishlist not found with a Customer Id ${customer_id} `)
		}

		const list = this.wishlist[storeKey][customerKey].findIndex((elem) => {
			return elem["product_id"] === product_id && elem["variant_id"] === variant_id
		})

		if (list === -1) throw new NotFoundException(`Wishlist not found with a Product/Variant Id`)

		this.wishlist[storeKey][customerKey].splice(list, 1)

		return { message: "Wishlist Deleted Successfully", status: "Success" }
	}
}
