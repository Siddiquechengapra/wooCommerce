import { Test, TestingModule } from "@nestjs/testing"
import { mockRequestObject } from "test/utils/setup"
import { CheckoutService } from "./checkout.service"
import { UtilsModule } from "src/utils/utils.module"
import { ProductsService } from "src/products/products.service"
import { WooStoreService } from "src/woo-store/woo-store.service"
import { PdpService } from "src/pdp/pdp.service"
import * as wooStoreSettingsData from "test/data/checkout/wooStore.json"
import * as productData from "test/data/checkout/product.json"
import * as discountData from "test/data/checkout/discount.json"
import { HttpModule } from "@nestjs/axios"
import * as output from "test/data/checkout/expectedOut.json"
import * as checkoutDto from "test/data/checkout/dto.json"

describe("CheckoutService", () => {
	let checkoutService: CheckoutService

	beforeEach(async () => {
		const ProductServiceMock = {
			provide: ProductsService,
			useFactory: () => ({
				getProduct: jest.fn(() => productData)
			})
		}

		const WooStoreServiceMock = {
			provide: WooStoreService,
			useFactory: () => ({
				getWooStoreSettings: jest.fn(() => wooStoreSettingsData)
			})
		}

		const PdpServiceMock = {
			provide: PdpService,
			useFactory: () => ({
				calculateDiscount: jest.fn(() => discountData)
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			imports: [UtilsModule, HttpModule],
			providers: [CheckoutService, ProductServiceMock, WooStoreServiceMock, PdpServiceMock]
		}).compile()

		checkoutService = app.get<CheckoutService>(CheckoutService)
	})

	it("should be defined", () => {
		expect(checkoutService).toBeDefined()
	})

	describe("calculateTax", () => {
		it("should return an object tax information", async () => {
			const request = mockRequestObject()

			const dto = checkoutDto

			const calculateTaxSpy = jest.spyOn(checkoutService, "calculateTax")
			const calculateTax = await checkoutService.calculateTax(dto, request)
			expect(calculateTaxSpy).toHaveBeenCalled()
			expect(calculateTaxSpy).toHaveBeenCalledWith(dto, request)
			expect(calculateTax).toEqual(
				expect.objectContaining({
					tax_inclusive: output.tax_inclusive,
					price_breakup: output.price_breakup,
					available_tax_rates: output.available_tax_rates
					// products: output.products
				})
			)
		})
	})
})
