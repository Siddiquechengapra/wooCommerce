import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { Test, TestingModule } from "@nestjs/testing"
import { PdpDto } from "./dto/pdp.dto"
import { DetailDto } from "./dto/detail.dto"
import { PdpService } from "./pdp.service"
import { PdpController } from "./pdp.controller"
import * as mockPdpData from "test/data/pdp/mock-pdp-data.json"
import * as mockPdpDetailsData from "test/data/pdp/mock-pdpConfig&Data-data.json"
import * as customMessage from "./messages/custom-messages.json"


describe("PdpController", () => {
	let pdpController: PdpController
	let spyService: PdpService

	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: PdpService,
			useFactory: () => ({
				pdp: jest.fn(() => ({
					product_id: mockPdpData.product_id,
					product_name: mockPdpData.product_name,
					product_sku: mockPdpData.product_sku,
					product_brand: mockPdpData.product_brand,
					slug: mockPdpData.slug,
					permalink: mockPdpData.permalink,
					description: mockPdpData.description,
					short_description: mockPdpData.short_description,
					price: mockPdpData.price,
					regular_price: mockPdpData.regular_price,
					sale_price: mockPdpData.sale_price,
					product_type: mockPdpData.product_type,
					date_on_sale_from_gmt: mockPdpData.date_on_sale_from_gmt,
					date_on_sale_to_gmt: mockPdpData.date_on_sale_to_gmt,
					on_sale: mockPdpData.on_sale,
					purchasable: mockPdpData.purchasable,
					virtual: mockPdpData.virtual,
					downloadable: mockPdpData.downloadable,
					shipping_required: mockPdpData.shipping_required,
					shipping_taxable: mockPdpData.shipping_taxable,
					shipping_class: mockPdpData.shipping_class,
					shipping_class_id: mockPdpData.shipping_class_id,
					tax_class: mockPdpData.tax_class,
					reviews_allowed: mockPdpData.reviews_allowed,
					average_rating: mockPdpData.average_rating,
					rating_count: mockPdpData.rating_count,
					grouped_products: mockPdpData.grouped_products,
					weight: mockPdpData.weight,
					dimensions: mockPdpData.dimensions,
					product_attributes: mockPdpData.product_attributes,
					created_at: mockPdpData.created_at,
					updated_at: mockPdpData.updated_at,
					tags: mockPdpData.tags,
					images: mockPdpData.images,
					variants: mockPdpData.variants,
					currency: mockPdpData.currency,
					discount_percentage: mockPdpData.discount_percentage,
					message: customMessage.PRODUCT_DETAIL_SUCCESS
				})),
				detail: jest.fn(() => ({
					version: mockPdpDetailsData.version,
					page_name: mockPdpDetailsData.page_name,
					store_id: mockPdpDetailsData.store_id,
					data: mockPdpDetailsData.data,
					header_widgets: mockPdpDetailsData.header_widgets,
					scroll_widgets: mockPdpDetailsData.scroll_widgets,
					footer_widgets: mockPdpDetailsData.footer_widgets,
					message: customMessage.PRODUCT_WITH_DATA_AND_CONFIG_SUCCESS
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [PdpController],
			providers: [PdpService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		pdpController = app.get<PdpController>(PdpController)
		spyService = app.get<PdpService>(PdpService)
	})

	it("should be defined", () => {
		expect(pdpController).toBeDefined()
	})

	describe("/pdp", () => {
		it("should return an object with pdp information", async () => {
			const request = mockRequestObject()

			const dto = new PdpDto()

			const pdp = await pdpController.pdp(dto, request)

			expect(spyService.pdp).toHaveBeenCalled()

			expect(spyService.pdp).toHaveBeenCalledWith(dto, request)

			expect(pdp).toEqual(
				expect.objectContaining({
					product_id: mockPdpData.product_id,
					product_name: mockPdpData.product_name,
					product_sku: mockPdpData.product_sku,
					product_brand: mockPdpData.product_brand,
					slug: mockPdpData.slug,
					permalink: mockPdpData.permalink,
					description: mockPdpData.description,
					short_description: mockPdpData.short_description,
					price: mockPdpData.price,
					regular_price: mockPdpData.regular_price,
					sale_price: mockPdpData.sale_price,
					product_type: mockPdpData.product_type,
					date_on_sale_from_gmt: mockPdpData.date_on_sale_from_gmt,
					date_on_sale_to_gmt: mockPdpData.date_on_sale_to_gmt,
					on_sale: mockPdpData.on_sale,
					purchasable: mockPdpData.purchasable,
					virtual: mockPdpData.virtual,
					downloadable: mockPdpData.downloadable,
					shipping_required: mockPdpData.shipping_required,
					shipping_taxable: mockPdpData.shipping_taxable,
					shipping_class: mockPdpData.shipping_class,
					shipping_class_id: mockPdpData.shipping_class_id,
					tax_class: mockPdpData.tax_class,
					reviews_allowed: mockPdpData.reviews_allowed,
					average_rating: mockPdpData.average_rating,
					rating_count: mockPdpData.rating_count,
					grouped_products: mockPdpData.grouped_products,
					weight: mockPdpData.weight,
					dimensions: mockPdpData.dimensions,
					product_attributes: mockPdpData.product_attributes,
					created_at: mockPdpData.created_at,
					updated_at: mockPdpData.updated_at,
					tags: mockPdpData.tags,
					images: mockPdpData.images,
					variants: mockPdpData.variants,
					currency: mockPdpData.currency,
					discount_percentage: mockPdpData.discount_percentage,
					message: customMessage.PRODUCT_DETAIL_SUCCESS
				})
			)
		})
	})
	describe("/detail", () => {
		it("should return an object with pdp config and data", async () => {
			const request = mockRequestObject()

			const dto = new DetailDto()

			const detail = await pdpController.detail(dto, request)

			expect(spyService.detail).toHaveBeenCalled()

			expect(spyService.detail).toHaveBeenCalledWith(dto, request)

			expect(detail).toEqual(
				expect.objectContaining({
					version: mockPdpDetailsData.version,
					page_name: mockPdpDetailsData.page_name,
					store_id: mockPdpDetailsData.store_id,
					data: mockPdpDetailsData.data,
					header_widgets: mockPdpDetailsData.header_widgets,
					scroll_widgets: mockPdpDetailsData.scroll_widgets,
					footer_widgets: mockPdpDetailsData.footer_widgets,
					message: customMessage.PRODUCT_WITH_DATA_AND_CONFIG_SUCCESS
				})
			)
		})
	})
})
