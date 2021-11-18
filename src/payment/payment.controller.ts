import { Controller, Body, Get, Post, UseGuards, Req, Param } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { Request } from "express"
import { PaymentService } from "./payment.service"
import { CreateCustomerDto, CreatePaymentSheetDto, DecryptTextDTO } from "./dto/stripe-customer.dto"

@ApiTags("Payment")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("/customer")
	@ApiOperation({ summary: "createustomer" })
	@ApiOkResponse({ description: "Customer created" })
	login(@Body() body: CreateCustomerDto, @Req() req: Request): Promise<any> {
		return this.paymentService.createCustomer(body, req)
	}

	@Post("/payment-sheet")
	@ApiOperation({ summary: "create payment sheet" })
	@ApiOkResponse({ description: "Payment sheet created" })
	createpaymentSheet(@Body() body: CreatePaymentSheetDto, @Req() req: Request): Promise<any> {
		return this.paymentService.createSheet(body, req)
	}

	@Get("/config/:store")
	getConfig(@Req() req: Request, @Param("store") store: string): Promise<any> {
		return this.paymentService.getKey(req, store)
	}

	@Post("/decrypt")
	decrypText(@Body() body: DecryptTextDTO): Promise<any> {
		return this.paymentService.decryptText(body)
	}
}
