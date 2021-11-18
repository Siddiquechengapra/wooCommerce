import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { Product } from "./interface/pdp.interface"
import { DetailDto } from "./dto/detail.dto"
import { PdpService } from "./pdp.service"
import { PdpDto } from "./dto/pdp.dto"
import { Request } from "express"
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiBearerAuth,
	ApiNotFoundResponse
} from "@nestjs/swagger"

@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("products")
export class PdpController {
	constructor(private readonly pdpService: PdpService) {}

	@Get("pdp")
	@ApiOperation({ summary: "Product Detail Page" })
	@ApiOkResponse({ description: "The product is found" })
	@ApiNotFoundResponse({ description: "Product/Store is not found" })
	pdp(@Query() query: PdpDto, @Req() req: Request): Promise<Product> {
		return this.pdpService.pdp(query, req)
	}

	@Get("detail")
	@ApiOperation({ summary: "Product Detail Page & Config" })
	@ApiOkResponse({ description: "The found product detail & config" })
	detail(@Query() query: DetailDto, @Req() req: Request) {
		return this.pdpService.detail(query, req)
	}
}
