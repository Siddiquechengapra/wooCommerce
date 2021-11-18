import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { CheckoutService } from "./checkout.service"
import { TaxDto } from "./dto/tax.dto"
import { Request } from "express"
import { ShippingDto } from "src/checkout/dto/shipping.dto"
import { ShippingMethod } from "src/checkout/interface/shipping.interface"

@ApiTags("Checkout")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("checkout")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Post("tax")
	@ApiOperation({ summary: "Calculate Tax" })
	@ApiOkResponse({ description: "Calculated Taxes" })
	calculateTax(@Body() body: TaxDto, @Req() req: Request): Promise<any> {
		return this.checkoutService.calculateTax(body, req)
	}
	@Post("shipping-methods")
	@ApiOperation({ summary: "Calculate Shipping Rate" })
	@ApiOkResponse({ description: "Calculated Shipping Rate" })
	calculateShipping(@Body() body: ShippingDto, @Req() req: Request): Promise<ShippingMethod> {
		return this.checkoutService.calculateShipping(body, req)
	}
}
