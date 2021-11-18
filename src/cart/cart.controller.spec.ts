import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { Test, TestingModule } from "@nestjs/testing"
import { CartController } from "./cart.controller"
import { CartService } from "./cart.service"
import { RefreshCartDto } from "./dto/refresh.dto"
import * as mockRefreshCartData from "test/data/mock-refresh-cart-data.json"

describe("CartController", () => {
	let cartController: CartController
	let cartService: CartService

	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: CartService,
			useFactory: () => ({
				refreshCart: jest.fn(() => ({
					cart_products: [mockRefreshCartData]
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [CartController],
			providers: [CartService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		cartController = app.get<CartController>(CartController)
		cartService = app.get<CartService>(CartService)
	})

	it("should be defined", () => {
		expect(cartController).toBeDefined()
	})

	describe("/refresh", () => {
		it("should return an array of objects with refreshed cart information", async () => {
			const request = mockRequestObject()

			const cartDto = new RefreshCartDto()

			const refreshCart = await cartController.refreshCart(cartDto, request)

			expect(cartService.refreshCart).toHaveBeenCalled()

			expect(cartService.refreshCart).toHaveBeenCalledWith(cartDto, request)

			expect(refreshCart).toEqual(
				expect.objectContaining({
					cart_products: expect.arrayContaining([
						expect.objectContaining(mockRefreshCartData)
					])
				})
			)
		})
	})
})
