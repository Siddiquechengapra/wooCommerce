import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { Test, TestingModule } from "@nestjs/testing"
import { AuthDto } from "./dto/auth.dto"
import { CustomersService } from "./customer.service"
import { CustomersController } from "./customer.controller"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { CreateCustomerDto, CustomerAddressDto, CustomerDto } from "./dto/customer-details.dto"
import * as customMessage from "./messages/custom-messages.json"
import * as mockCustomerData from "test/data/customer/mock-customer-data.json"
import { ResetPasswordDto } from "./dto/reset-password.dto"

const { customer_id, first_name, last_name, email, username, phone, contact_details } =
	mockCustomerData

describe("CustomersController", () => {
	let customersController: CustomersController
	let customersService: CustomersService

	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: CustomersService,
			useFactory: () => ({
				login: jest.fn(() => ({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					phone: phone,
					message: customMessage.LOGIN_SUCCESS
				})),
				updatePassword: jest.fn(() => ({
					customer_id: customer_id,
					user_name: username,
					message: customMessage.UPDATE_PASSWORD_SUCCESS
				})),
				addCustomer: jest.fn(() => ({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					message: customMessage.CREATE_CUSTOMER_SUCCESS
				})),
				findCustomer: jest.fn(() => ({
					customer_id: customer_id,
					first_name: first_name,
					last_name: last_name,
					email: email,
					user_name: username,
					phone: phone,
					contact_details: {
						first_name: first_name,
						last_name: last_name,
						address_1: contact_details.address_1,
						address_2: contact_details.address_1,
						city: contact_details.city,
						country: contact_details.country,
						state: contact_details.state,
						zip_code: contact_details.zip_code,
						phone_number: contact_details.phone_number
					}
				})),
				updateCustomer: jest.fn(() => ({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					phone: phone,
					message: customMessage.UPDATE_CUSTOMER_SUCCESS
				})),
				deleteAddress: jest.fn(() => ({
					customer_id: customer_id,
					message: customMessage.DELETE_ADDRESS_SUCCESS
				})),
				resetPassword: jest.fn(() => ({
					message: "Check your email for the reset password link"
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [CustomersController],
			providers: [CustomersService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		customersController = app.get<CustomersController>(CustomersController)
		customersService = app.get<CustomersService>(CustomersService)
	})

	it("should be defined", () => {
		expect(customersController).toBeDefined()
	})

	describe("/login", () => {
		it("should return an object with customer information", async () => {
			const request = mockRequestObject()

			const dto = new AuthDto()

			const login = await customersController.login(dto, request)

			expect(customersService.login).toHaveBeenCalled()

			expect(customersService.login).toHaveBeenCalledWith(dto, request)

			expect(login).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					phone: phone,
					message: customMessage.LOGIN_SUCCESS
				})
			)
		})
	})
	describe("/update-password", () => {
		it("should return an object with updated password message", async () => {
			const request = mockRequestObject()

			const dto = new UpdatePasswordDto()

			const updatePassword = await customersController.updatePassword(dto, request)

			expect(customersService.updatePassword).toHaveBeenCalled()

			expect(customersService.updatePassword).toHaveBeenCalledWith(dto, request)

			expect(updatePassword).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					user_name: username,
					message: customMessage.UPDATE_PASSWORD_SUCCESS
				})
			)
		})
	})

	describe("/create-customer", () => {
		it("should return an object with customer details", async () => {
			const request = mockRequestObject()

			const dto = new CreateCustomerDto()

			const addCustomer = await customersController.addCustomer(dto, request)

			expect(customersService.addCustomer).toHaveBeenCalled()

			expect(customersService.addCustomer).toHaveBeenCalledWith(dto, request)

			expect(addCustomer).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					message: customMessage.CREATE_CUSTOMER_SUCCESS
				})
			)
		})
	})

	describe("/search-customer", () => {
		it("should return an object with customer details", async () => {
			const request = mockRequestObject()

			const dto = new CustomerDto()

			const findCustomer = await customersController.findCustomer(dto, request)

			expect(customersService.findCustomer).toHaveBeenCalled()

			expect(customersService.findCustomer).toHaveBeenCalledWith(dto, request)

			expect(findCustomer).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					first_name: first_name,
					last_name: last_name,
					email: email,
					user_name: username,
					phone: phone,
					contact_details: expect.objectContaining({
						first_name: first_name,
						last_name: last_name,
						address_1: contact_details.address_1,
						address_2: contact_details.address_1,
						city: contact_details.city,
						country: contact_details.country,
						state: contact_details.state,
						zip_code: contact_details.zip_code,
						phone_number: contact_details.phone_number
					})
				})
			)
		})
	})

	describe("/update-customer", () => {
		it("should return an object with updated customer details", async () => {
			const request = mockRequestObject()

			const body = new CustomerAddressDto()

			const dto = new CustomerDto()

			const updateCustomer = await customersController.updateCustomer(body, dto, request)

			expect(customersService.updateCustomer).toHaveBeenCalled()

			expect(customersService.updateCustomer).toHaveBeenCalledWith(body, dto, request)

			expect(updateCustomer).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					user_name: username,
					first_name: first_name,
					last_name: last_name,
					email: email,
					phone: phone,
					message: customMessage.UPDATE_CUSTOMER_SUCCESS
				})
			)
		})
	})

	describe("/delete-customer address", () => {
		it("should return an object with updated customer details", async () => {
			const request = mockRequestObject()

			const dto = new CustomerDto()

			const deleteAddress = await customersController.deleteAddress(request, dto)

			expect(customersService.deleteAddress).toHaveBeenCalled()

			expect(customersService.deleteAddress).toHaveBeenCalledWith(dto, request)

			expect(deleteAddress).toEqual(
				expect.objectContaining({
					customer_id: customer_id,
					message: customMessage.DELETE_ADDRESS_SUCCESS
				})
			)
		})
	})

	describe("/reset-password", () => {
		it("should return a message whether the reset link was sent or not ", async () => {
			const request = mockRequestObject()

			const dto = new ResetPasswordDto()

			const resetPassword = await customersController.resetPassword(dto, request)

			expect(customersService.resetPassword).toHaveBeenCalled()

			expect(customersService.resetPassword).toHaveBeenCalledWith(dto, request)

			expect(resetPassword).toEqual(
				expect.objectContaining({
					message: "Check your email for the reset password link"
				})
			)
		})
	})
})
