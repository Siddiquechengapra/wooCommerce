import { Test, TestingModule } from "@nestjs/testing"
import { mockRequestObject } from "test/utils/setup"
import { PdpService } from "./pdp.service"
import { UtilsModule } from "src/utils/utils.module"
import { HttpModule } from "@nestjs/axios"
import { PdpDto } from "./dto/pdp.dto"
import { DetailDto } from "./dto/detail.dto"
import * as configData from "test/data/config/pdp-config.json"
import { ConfigService } from "src/config/config.service"
import * as pdpData from "test/data/pdp/product.json"

describe("PdpService", () => {
	let pdpService: PdpService

	beforeEach(async () => {
		const ConfigServiceMock = {
			provide: ConfigService,
			useFactory: () => ({
				pdpConfig: jest.fn(() => configData)
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			imports: [UtilsModule, HttpModule],
			providers: [PdpService, ConfigServiceMock]
		}).compile()

		pdpService = app.get<PdpService>(PdpService)
	})

	it("should be defined", () => {
		expect(pdpService).toBeDefined()
	})

	describe("pdp", () => {
		it("should return an object with product pdp information", async () => {
			const request = mockRequestObject()
			const dto = new PdpDto()
			const pdpSpy = jest.spyOn(pdpService, "pdp")

			const pdp = await pdpService.pdp(dto, request)

			expect(pdpSpy).toHaveBeenCalled()

			expect(pdpSpy).toHaveBeenCalledWith(dto, request)

			expect(pdp).toEqual(
				expect.objectContaining({
					product_id: pdpData.id,
					product_name: pdpData.name,
					product_sku: pdpData.sku,
					slug: pdpData.slug,
					permalink: pdpData.permalink,
					description: pdpData.description,
					short_description: pdpData.short_description,
					price: Number(pdpData.price),
					regular_price: pdpData.regular_price || null,
					sale_price: pdpData.sale_price || null,
					product_type: pdpData.type
				})
			)
		})
	})

	describe("detail", () => {
		it("should return an object with product pdp information", async () => {
			const request = mockRequestObject()
			const dto = new DetailDto()
			const pdpdetailSpy = jest.spyOn(pdpService, "detail")

			const detail = await pdpService.detail(dto, request)

			expect(pdpdetailSpy).toHaveBeenCalled()

			expect(pdpdetailSpy).toHaveBeenCalledWith(dto, request)

			expect(detail).toEqual(
				expect.objectContaining({
					version: configData.version,
					page_name: configData.page_name,
					store_id: configData.store_id,
					config: configData.config,
					header_widgets: configData.header_widgets,
					scroll_widgets: configData.scroll_widgets,
					footer_widgets: configData.footer_widgets
				})
			)
		})
	})
})
