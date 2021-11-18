import { Body, Get, Controller, Post, Query, UseGuards, Put, Req, Delete } from "@nestjs/common"
import { CreateCustomer, UpdatePasswordResponse } from "./interfaces/vajro-customer.interface"
import { CustomerToken } from "./interfaces/customer-token.interface"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { CustomersService } from "./customer.service"
import { AuthDto } from "./dto/auth.dto"
import { Request } from "express"
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse,
	ApiNotFoundResponse
} from "@nestjs/swagger"
import { CustomerDto, CustomerAddressDto, CreateCustomerDto } from "./dto/customer-details.dto"
import {
	CustomerDetails,
	CustomerDeleteAddress,
	Customer
} from "./interfaces/vajro-customer.interface"
@ApiTags("Customer")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("customer")
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post("/login")
	@ApiOperation({ summary: "Login / Sign in" })
	@ApiOkResponse({ description: "Login / Sign in successfully" })
	login(@Body() body: AuthDto, @Req() req: Request): Promise<CustomerToken> {
		return this.customersService.login(body, req)
	}

	@Post("update-password")
	@ApiOperation({ summary: "Update Password" })
	@ApiOkResponse({ description: "Update password successfully" })
	@ApiBadRequestResponse({ description: "Bad Request" })
	updatePassword(
		@Body() body: UpdatePasswordDto,
		@Req() req: Request
	): Promise<UpdatePasswordResponse> {
		return this.customersService.updatePassword(body, req)
	}

	@Post("")
	@ApiOperation({ summary: "create customer" })
	@ApiOkResponse({ description: "customer is created" })
	@ApiBadRequestResponse({ description: "Bad Request Invalid Customer details" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async addCustomer(
		@Body() body: CreateCustomerDto,
		@Req() req: Request
	): Promise<CreateCustomer> {
		return await this.customersService.addCustomer(body, req)
	}

	@Get("")
	@ApiOperation({ summary: "Search customer" })
	@ApiOkResponse({ description: "The customer is found" })
	@ApiNotFoundResponse({ description: "Customer is not found" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async findCustomer(@Query() query: CustomerDto, @Req() req: Request): Promise<Customer> {
		return await this.customersService.findCustomer(query, req)
	}

	@Put()
	@ApiOperation({ summary: "Update customer" })
	@ApiCreatedResponse({ description: "The customer updated successfully" })
	async updateCustomer(
		@Body() body: CustomerAddressDto,
		@Query() query: CustomerDto,
		@Req() req: Request
	): Promise<CustomerDetails> {
		return await this.customersService.updateCustomer(body, query, req)
	}

	@Delete("/address")
	@ApiOperation({ summary: "delete customer address" })
	@ApiCreatedResponse({ description: "The customer address deleted successfully" })
	async deleteAddress(
		@Req() req: Request,
		@Query() query: CustomerDto
	): Promise<CustomerDeleteAddress> {
		return await this.customersService.deleteAddress(req, query)
	}

	@Get("reset-password")
	@ApiOperation({ summary: "Reset Password" })
	@ApiOkResponse({ description: "Password reset link sent to email" })
	@ApiBadRequestResponse({ description: "Email not registered" })
	resetPassword(@Query() query: ResetPasswordDto, @Req() req: Request): Promise<any> {
		return this.customersService.resetPassword(query, req)
	}
}
