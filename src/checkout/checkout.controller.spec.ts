import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { Test, TestingModule } from "@nestjs/testing"
import { CheckoutService } from "./checkout.service"
import { CheckoutController } from "./checkout.controller"
import * as checkoutData from "test/data/checkout/checkout.json"
import { TaxDto } from "./dto/tax.dto"

describe("CheckoutController", () => {
	let checkoutController: CheckoutController
	let checkoutService: CheckoutService

	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: CheckoutService,
			useFactory: () => ({
				calculateTax: jest.fn(() => ({
					tax_inclusive: checkoutData.tax_inclusive,
					products: checkoutData.products,
					price_breakup: checkoutData.price_breakup,
					shipping_options: checkoutData.shipping_options,
					available_tax_rates: checkoutData.available_tax_rates
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [CheckoutController],
			providers: [CheckoutService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		checkoutController = app.get<CheckoutController>(CheckoutController)
		checkoutService = app.get<CheckoutService>(CheckoutService)
	})

	it("should be defined", () => {
		expect(checkoutController).toBeDefined()
	})

	describe("/tax", () => {
		it("should return an object with customer information", async () => {
			const request = mockRequestObject()

			const dto = new TaxDto()

			const calculateTax = await checkoutController.calculateTax(dto, request)

			expect(checkoutService.calculateTax).toHaveBeenCalled()

			expect(checkoutService.calculateTax).toHaveBeenCalledWith(dto, request)

			expect(calculateTax).toEqual(
				expect.objectContaining({
					tax_inclusive: checkoutData.tax_inclusive,
					products: checkoutData.products,
					price_breakup: checkoutData.price_breakup,
					shipping_options: checkoutData.shipping_options,
					available_tax_rates: checkoutData.available_tax_rates
				})
			)
		})
	})
})
