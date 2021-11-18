import { ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { Controller, Post, UseGuards, Body, Req } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { WooStoreService } from "./woo-store.service"
import { SettingsDto } from "./dto/settings.dto"
import { Request } from "express"

@ApiTags("Woo Store")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("woo-store")
export class WooStoreController {
	constructor(private readonly wooStoreService: WooStoreService) {}

	@Post("settings")
	@ApiOperation({ summary: "Woo Store" })
	@ApiOkResponse({ description: "List of Woo Store settings" })
	getAll(@Body() body: SettingsDto, @Req() req: Request): Promise<any> {
		return this.wooStoreService.getWooStoreSettings(body, req)
	}
}
