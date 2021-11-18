import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { SearchProductsDto } from "./dto/search-products.dto"
import { ProductsController } from "./products.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { ProductsService } from "./products.service"

describe("ProductsController", () => {
	let productsController: ProductsController
	let spyService: ProductsService

	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: ProductsService,
			useFactory: () => ({
				searchProducts: jest.fn(() => [
					{
						product_list: {
							product_id: 1,
							product_name: "Shoe"
						},
						current_page_no: 1
					}
				])
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [ProductsService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		productsController = app.get<ProductsController>(ProductsController)
		spyService = app.get<ProductsService>(ProductsService)
	})

	it("should be defined", () => {
		expect(productsController).toBeDefined()
	})

	describe("/search", () => {
		it("should return an array of products", async () => {
			const request = mockRequestObject()

			const dto = new SearchProductsDto()

			const search = await productsController.search(dto, request)

			expect(spyService.searchProducts).toHaveBeenCalled()

			expect(spyService.searchProducts).toHaveBeenCalledWith(dto, request)

			expect(search).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						product_list: expect.objectContaining({
							product_id: expect.any(Number),
							product_name: expect.any(String)
						})
					})
				])
			)
		})
	})
})
