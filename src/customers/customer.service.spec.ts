import * as mockCustomerData from "test/data/customer/mock-customer-data.json"
import * as mockAddCustomer from "test/data/customer/woo-customer-create-data.json"
import { StoresService } from "src/stores/stores.service"
import { Test, TestingModule } from "@nestjs/testing"
import { mockRequestObject } from "test/utils/setup"
import { CustomersService } from "./customer.service"
import { UtilsModule } from "src/utils/utils.module"
import { HttpModule } from "@nestjs/axios"
import { AuthDto } from "./dto/auth.dto"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { CreateCustomerDto } from "./dto/customer-details.dto"

import { UtilsService } from "src/utils/utils.service"

const { customer_id, first_name, username, last_name, email, phone } = mockCustomerData

describe("CustomersService", () => {
	let customersService: CustomersService

	beforeEach(async () => {
		// const LoginMock = {
		//     provide: UtilsService,
		//     useFactory: () => ({
		//         // asyncWrapper: jest.fn(async (test) => {
		//         //     console.log(await test)
		//         //     return Promise.resolve()
		//         asyncWrapper: jest.fn(() => ({
		//             customer_id: mockCustomerData.customer_id,
		//             user_name: mockCustomerData.username,
		//             first_name: mockCustomerData.first_name,
		//             last_name: mockCustomerData.last_name,
		//             email: mockCustomerData.email,
		//             phone: mockCustomerData.phone,
		//             message: "Customer Logged in Successfully"

		//         }))

		//     })
		// }

		const app: TestingModule = await Test.createTestingModule({
			imports: [UtilsModule, HttpModule],
			providers: [CustomersService]
		}).compile()

		customersService = app.get<CustomersService>(CustomersService)
	})

	it("should be defined", () => {
		expect(customersService).toBeDefined()
	})

	describe("login", () => {
		it("should return an object with customer information", async () => {
			const request = mockRequestObject()

			const dto = new AuthDto()
			const loginSpy = jest.spyOn(customersService, "login")
			const login = await customersService.login(dto, request)
			expect(loginSpy).toHaveBeenCalled()
			expect(loginSpy).toHaveBeenCalledWith(dto, request)
			expect(login).toEqual(
				expect.objectContaining({
					customer_id: mockCustomerData.customer_id,
					user_name: mockCustomerData.username,
					first_name: mockCustomerData.first_name,
					last_name: mockCustomerData.last_name,
					email: mockCustomerData.email,
					phone: mockCustomerData.phone,
					message: "Customer Logged in Successfully"
				})
			)
		})
	})
	describe("updatePassword", () => {
		it("should return an object with customer updated information", async () => {
			const request = mockRequestObject()
			const dto = {
				id: 55,
				username: "ken@miles.com",
				old_password: "test",
				new_password: "test1"
			}
			const upspy = jest.spyOn(customersService, "updatePassword")
			const up = await customersService.updatePassword(dto, request)
			expect(upspy).toHaveBeenCalled()
			expect(upspy).toHaveBeenCalledWith(dto, request)
			expect(up).toEqual(
				expect.objectContaining({
					customer_id: dto.id,
					user_name: dto.username,
					message: "Password Updated Successfully"
				})
			)
		})
	})
	describe("addCustomer", () => {
		it("should return an object with customer information", async () => {
			const request = mockRequestObject()

			const dto = new CreateCustomerDto()
			const addCustomer = jest.spyOn(customersService, "addCustomer")
			const up = await customersService.addCustomer(dto, request)
			expect(addCustomer).toHaveBeenCalled()
			expect(addCustomer).toHaveBeenCalledWith(dto, request)
			expect(up).toEqual(
				expect.objectContaining({
					customer_id: mockAddCustomer.id,
					user_name: mockAddCustomer.username,
					first_name: mockAddCustomer.first_name,
					last_name: mockAddCustomer.last_name,
					email: mockAddCustomer.email,
					message: "Customer Created Successfully"
				})
			)
		})
	})

	describe("resetPassword", () => {
		it("should return a message whetether a reset link was sent", async () => {
			const request = mockRequestObject()

			const dto = {
				email: "siddique.chengapra@rap.ventures"
			}
			const resetPasswordSpy = jest.spyOn(customersService, "resetPassword")
			const resetPassword = await customersService.resetPassword(dto, request)
			expect(resetPasswordSpy).toHaveBeenCalled()
			expect(resetPasswordSpy).toHaveBeenCalledWith(dto, request)
			expect(resetPassword).toEqual(
				expect.objectContaining({
					message: "Check your email for the reset password link"
				})
			)
		})
	})
})
