import { Injectable, Inject, forwardRef } from "@nestjs/common"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { UtilsService } from "src/utils/utils.service"
import { RefreshCartDto } from "./dto/refresh.dto"
import { Request } from "express"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { CustomException } from "src/custom-exception"
import { RefreshCart, RefreshProduct } from "./interface/refresh-cart.interface"

@Injectable()
export class CartService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async getProduct(
		WooCommerce: WooCommerceRestApi,
		productId: string,
		variantId: string
	): Promise<RefreshProduct> {
		const prodReq = WooCommerce.get(`products/${productId}`)

		const [prodErr] = await this.utilsService.asyncWrapper(prodReq)

		if (prodErr) throw new Error()

		const endpoint = variantId
			? `products/${productId}/variations/${variantId}`
			: `products/${productId}`

		const request = WooCommerce.get(endpoint)

		const [error, response] = await this.utilsService.asyncWrapper(request)

		if (error) throw new Error()

		const { stock_quantity, regular_price, sale_price } = response.data

		return {
			product_id: productId,
			variant_id: variantId,
			inventory_quantity: stock_quantity ? stock_quantity : null,
			regular_price: regular_price ? Number(regular_price) : null,
			sale_price: sale_price ? Number(sale_price) : null
		}
	}

	async refreshCart(body: RefreshCartDto, req: Request): Promise<RefreshCart> {
		const { WooCommerce } = req.user as ReqUser

		const { cart_products } = body

		const products = cart_products.map((cart: any) => {
			const { product_id, variant_id } = cart

			return this.getProduct(WooCommerce, product_id, variant_id)
		})

		const productsReq = Promise.allSettled(products)

		const [productsErr, productsResp] = await this.utilsService.asyncWrapper(productsReq)

		if (productsErr) {
			const { status, data } = productsErr.response

			const { code, message } = data

			throw new CustomException({ code, message }, status)
		}

		const productsData = productsResp
			.filter((resp: any) => resp.status === "fulfilled")
			.map((prod: any) => prod.value)

		return {
			status: "success",
			data: productsData
		}
	}
}
