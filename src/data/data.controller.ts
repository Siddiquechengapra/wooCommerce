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
import { DataService } from "./data.service"
import { CountryResponseT } from "./interfaces/countries.interface"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { Request } from "express"
import { StateListDto } from "./dto/states.dto"
import { StateResponseT } from "./interfaces/states.interface"
import { CurrencyResponseT,CurrencyT } from "./interfaces/currencies.interface"

@ApiTags("Data")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("data")
export class DataController {
	constructor(private readonly dataService: DataService) {}

	@Get("/countries")
	@ApiOperation({ summary: "To fetch all country listt" })
	@ApiOkResponse({ description: "Countries are listed" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	findAll(@Req() req: Request): Promise<CountryResponseT> {
		return this.dataService.findCountry(req)
	}

	@Get("/states")
	@ApiOperation({ summary: "Fetch StateList" })
	@ApiOkResponse({ description: "To fetch all states list" })
	@ApiOperation({ summary: "To fetch all country listt" })
	@ApiOkResponse({ description: "States are listed" })
	@ApiNotFoundResponse({ description: "Country code is not found" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	async stateDetail(@Query() query: StateListDto, @Req() req: Request): Promise<StateResponseT> {
		return await this.dataService.findState(req, query)
	}

	@Get("/currencies")
	@ApiOperation({ summary: "To fetch all currency list" })
	@ApiOkResponse({ description: "Currencies are listed" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	findAllcurrencies(@Req() req: Request): Promise<CurrencyResponseT> {
		return this.dataService.findCurrencies(req)
	}

	@Get("/currencies/:currency_name")
	@ApiOperation({ summary: "To fetch all currency list" })
	@ApiOkResponse({ description: "Currencies are listed" })
	@ApiInternalServerErrorResponse({ description: "Internal Server error" })
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	findCurrency(
		@Req() req: Request,
		@Param("currency_name") currency_name: string
	): Promise<CurrencyT> {
		return this.dataService.findCurrency(req, currency_name)
	}
}
