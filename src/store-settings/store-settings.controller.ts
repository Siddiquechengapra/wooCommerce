import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { StoreSettingsService } from "./stores-settings.service"
import { Controller, Get, Post, Query, UseGuards, Body, Put, Param, Req } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { Request } from "express"

@ApiTags("Store Settings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("store-settings")
export class StoreSettingsController {
	constructor(private readonly storeSettingsService: StoreSettingsService) {}

	@Get("")
	@ApiOperation({ summary: "Store Settings" })
	@ApiOkResponse({ description: "List store settings" })
	getStoreSettings(@Req() req: Request): Promise<any> {
		return this.storeSettingsService.storeSettings(req)
	}
}
