import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Controller, Get, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { HomePageService } from "./home-page.service"
import { Request } from "express"

@ApiTags("Home Page")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("home-page")
export class HomePageController {
	constructor(private readonly homePageService: HomePageService) {}

	@Get("config")
	@ApiOperation({ summary: "Fetch Home Page Config" })
	@ApiOkResponse({ description: "Home Page Config" })
	homePageConfig(@Req() req: Request): Promise<any> {
		return this.homePageService.homePageConfig(req)
	}
}
