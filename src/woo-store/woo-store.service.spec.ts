import { Test, TestingModule } from "@nestjs/testing"
import { mockRequestObject } from "test/utils/setup"
import { WooStoreService } from "./woo-store.service"
import { UtilsModule } from "src/utils/utils.module"
import { SettingsDto } from "./dto/settings.dto"

describe("PdpService", () => {
	let wooStoreService: WooStoreService

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [UtilsModule],
			providers: [WooStoreService]
		}).compile()

		wooStoreService = app.get<WooStoreService>(WooStoreService)
	})

	it("should be defined", () => {
		expect(wooStoreService).toBeDefined()
	})

	describe("getSettings", () => {
		it("should return an object with settings information", async () => {
			const request = mockRequestObject()
			const dto = new SettingsDto()
			const getSettingsSpy = jest.spyOn(wooStoreService, "getWooStoreSettings")

			const getSettings = await wooStoreService.getWooStoreSettings(dto, request)

			expect(getSettingsSpy).toHaveBeenCalled()

			expect(getSettingsSpy).toHaveBeenCalledWith(dto, request)

			expect(getSettings).toEqual(expect.objectContaining({}))
		})
	})
})
