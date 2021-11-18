import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { Test, TestingModule } from "@nestjs/testing"
import { SettingsDto } from "./dto/settings.dto"
import { WooStoreService } from "./woo-store.service"
import { WooStoreController } from "./woo-store.controller"
import * as mockWooStoreSettings from "test/data/woo-store/settings.json"

describe("WooStoreController", () => {
	let wooStoreController: WooStoreController
	let wooStoreService: WooStoreService

	beforeEach(async () => {
		const MockWooStoreService = {
			provide: WooStoreService,
			useFactory: () => ({
				getWooStoreSettings: jest.fn(() => ({
					tax_setting: [
						{
							id: mockWooStoreSettings[0].id,
							value: mockWooStoreSettings[0].value,
							options: mockWooStoreSettings[0].options
						},
						{
							id: mockWooStoreSettings[1].id,
							value: mockWooStoreSettings[1].value,
							options: mockWooStoreSettings[1].options
						},
						{
							id: mockWooStoreSettings[2].id,
							value: mockWooStoreSettings[2].value,
							options: mockWooStoreSettings[2].options
						},
						{
							id: mockWooStoreSettings[3].id,
							value: mockWooStoreSettings[3].value,
							options: mockWooStoreSettings[3].options
						},
						{
							id: mockWooStoreSettings[4].id,
							value: mockWooStoreSettings[4].value,
							options: mockWooStoreSettings[4].options
						},
						{
							id: mockWooStoreSettings[5].id,
							value: mockWooStoreSettings[5].value,
							options: mockWooStoreSettings[5].options
						},
						{
							id: mockWooStoreSettings[6].id,
							value: mockWooStoreSettings[6].value,
							options: mockWooStoreSettings[6].options
						},
						{
							id: mockWooStoreSettings[7].id,
							value: mockWooStoreSettings[7].value,
							options: mockWooStoreSettings[7].options
						},
						{
							id: mockWooStoreSettings[8].id,
							value: mockWooStoreSettings[8].value,
							options: mockWooStoreSettings[8].options
						}
					]
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [WooStoreController],
			providers: [WooStoreService, MockWooStoreService, JwtGuardProvider]
		}).compile()

		wooStoreController = app.get<WooStoreController>(WooStoreController)
		wooStoreService = app.get<WooStoreService>(WooStoreService)
	})

	it("should be defined", () => {
		expect(wooStoreController).toBeDefined()
	})

	describe("/settings", () => {
		it("should return an object with setting details", async () => {
			const request = mockRequestObject()

			const dto = new SettingsDto()

			const wooStore = await wooStoreController.getAll(dto, request)

			expect(wooStoreService.getWooStoreSettings).toHaveBeenCalled()

			expect(wooStoreService.getWooStoreSettings).toHaveBeenCalledWith(dto, request)

			expect(wooStore).toEqual(
				expect.objectContaining({
					tax_setting: [
						{
							id: mockWooStoreSettings[0].id,
							value: mockWooStoreSettings[0].value,
							options: mockWooStoreSettings[0].options
						},
						{
							id: mockWooStoreSettings[1].id,
							value: mockWooStoreSettings[1].value,
							options: mockWooStoreSettings[1].options
						},
						{
							id: mockWooStoreSettings[2].id,
							value: mockWooStoreSettings[2].value,
							options: mockWooStoreSettings[2].options
						},
						{
							id: mockWooStoreSettings[3].id,
							value: mockWooStoreSettings[3].value,
							options: mockWooStoreSettings[3].options
						},
						{
							id: mockWooStoreSettings[4].id,
							value: mockWooStoreSettings[4].value,
							options: mockWooStoreSettings[4].options
						},
						{
							id: mockWooStoreSettings[5].id,
							value: mockWooStoreSettings[5].value,
							options: mockWooStoreSettings[5].options
						},
						{
							id: mockWooStoreSettings[6].id,
							value: mockWooStoreSettings[6].value,
							options: mockWooStoreSettings[6].options
						},
						{
							id: mockWooStoreSettings[7].id,
							value: mockWooStoreSettings[7].value,
							options: mockWooStoreSettings[7].options
						},
						{
							id: mockWooStoreSettings[8].id,
							value: mockWooStoreSettings[8].value,
							options: mockWooStoreSettings[8].options
						}
					]
				})
			)
		})
	})
})
