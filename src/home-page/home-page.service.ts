import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { ProductsService } from "src/products/products.service"
import { Injectable, Inject, forwardRef } from "@nestjs/common"
import { CustomException } from "src/custom-exception"
import { ConfigService } from "src/config/config.service"
import { UtilsService } from "src/utils/utils.service"
import { Request } from "express"

@Injectable()
export class HomePageService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		@Inject(forwardRef(() => ConfigService))
		public configService: ConfigService,
		@Inject(forwardRef(() => ProductsService))
		public productsService: ProductsService
	) {}

	async productList(widget: any, WooCommerce: WooCommerceRestApi) {
		const productList = widget?.store_data?.product_list || []

		const productsPromise = productList.map((product: any) => {
			const { product_id, variant_id } = product

			return this.productsService.getProduct(WooCommerce, product_id, variant_id)
		})

		const productsReq = Promise.allSettled(productsPromise)

		const [productsErr, productsResp] = await this.utilsService.asyncWrapper(productsReq)

		if (productsErr) {
			const { status, data } = productsErr.response

			const { code, message } = data

			throw new CustomException({ code, message }, status)
		}

		const productDetails = productsResp.map((res: any) => {
			const {
				product_id,
				variant_id,
				name,
				regular_price,
				sale_price,
				discount_percentage,
				inventory_quantity
			} = this.productsService.getProductsDetail(res)

			return {
				product_id,
				variant_id,
				product_name: name,
				regular_price,
				sale_price,
				discount_percentage,
				inventory_quantity
			}
		})

		return { product_list: productDetails }
	}

	categoryOrProduct(pathname: string, invalid: string, apiPrefix: string) {
		if (pathname.includes("product-category")) {
			const splitPathname = pathname.split("product-category/")[1]

			const slug = splitPathname ? splitPathname.split("/")[0] : null

			return slug ? `${apiPrefix}/products/list?slug=${slug}` : invalid
		}

		if (pathname.includes("product")) {
			const splitPathname = pathname.split("product/")[1]

			const slug = splitPathname ? splitPathname.split("/")[0] : null

			return slug ? `${apiPrefix}/products/detail?slug=${slug}` : "NA"
		}

		return invalid
	}

	getApiUrl(displayType: string, displayValue: string) {
		const invalid = "NA"

		const apiPrefix = "/api/v1"

		if (displayType !== "url") return invalid

		const { pathname } = new URL(displayValue)

		return this.categoryOrProduct(pathname, invalid, apiPrefix)
	}

	bannerHome(widget: any) {
		const urls = widget?.store_data?.urls || []

		const updatedUrls = urls.map((url: Record<string, string>) => {
			const { display_type, display_value } = url

			return { ...url, api_url: this.getApiUrl(display_type, display_value) }
		})

		return { urls: updatedUrls }
	}

	grid(widget: any) {
		const urls = widget?.store_data?.urls || []

		const updatedUrls = urls.map((url: Record<string, string>) => {
			const { display_type, display_value } = url

			return { ...url, api_url: this.getApiUrl(display_type, display_value) }
		})

		return { urls: updatedUrls }
	}

	async homePageConfig(req: Request): Promise<any> {
		const { WooCommerce, store_id } = req.user as ReqUser

		const version = "v1"

		const homeConfig = await this.configService.homeConfig(store_id, version)

		const { scroll_widgets } = homeConfig

		const widgetDataMethods = {
			product_list: this.productList,
			banner_home: this.bannerHome,
			grid: this.grid
		}

		const widgetDataPromise = scroll_widgets.map(async (widget) => {
			const { widget_name } = widget

			const widgetDataMethod = widgetDataMethods[widget_name]

			if (!widgetDataMethod) return { [widget_name]: null }

			return { [widget_name]: await widgetDataMethod.call(this, widget, WooCommerce) }
		})

		const widgetDataReq = Promise.all(widgetDataPromise)

		const [widgetDataErr, widgetDataResp] = await this.utilsService.asyncWrapper(widgetDataReq)

		if (widgetDataErr) {
			const { status, data } = widgetDataErr.response

			const { code, message } = data

			throw new CustomException({ code, message }, status)
		}

		const widgetData = widgetDataResp.reduce((acc, widget) => {
			const [key, value] = Object.entries(widget)[0] as [string, any]

			if (!value) return acc

			return { ...acc, [key as string]: value }
		}, {})

		const homeWidgetWithData = this.utilsService.widgetConfigAndData(homeConfig, widgetData)

		return {
			store_id,
			version,
			page: "home",
			...homeWidgetWithData
		}
	}
}
