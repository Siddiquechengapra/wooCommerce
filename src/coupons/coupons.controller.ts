import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger"
import { Controller, Query, Param, Get, UseGuards, Req } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { Request } from "express"
import { CouponsT } from "./interfaces/coupons.interface"
import { CouponsService } from "./coupons.service"

@ApiTags("Coupons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("coupons")
export class CouponsController {
	constructor(private readonly couponsService: CouponsService) {}

	@Get()
	@ApiOperation({ summary: "To fetch all coupons list" })
	@ApiOkResponse({ description: "coupons are listed" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async findAllcoupons(@Req() req: Request): Promise<CouponsT> {
		return await this.couponsService.findCoupons(req)
	}

	@Get(":coupon_id")
	@ApiOperation({ summary: "To fetch a single coupon by ID" })
	@ApiOkResponse({ description: "coupon retrieved " })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async findcoupon(@Req() req: Request,@Param("coupon_id") couponID:number): Promise<CouponsT> {
		return await this.couponsService.findCoupon(req,couponID)
	}
	
}
