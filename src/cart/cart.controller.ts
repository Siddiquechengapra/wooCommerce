import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { RefreshCartDto } from "./dto/refresh.dto"
import { CartService } from "./cart.service"
import { Request } from "express"
import { RefreshCart } from "./interface/refresh-cart.interface"

@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post("refresh")
	@ApiOperation({ summary: "Refresh Cart" })
	@ApiOkResponse({ description: "Refreshed Cart Products" })
	refreshCart(@Body() body: RefreshCartDto, @Req() req: Request): Promise<RefreshCart> {
		return this.cartService.refreshCart(body, req)
	}
}
