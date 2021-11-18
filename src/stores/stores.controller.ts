import { StoreResponse } from "./interfaces/store-response.interface"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { StoreDto } from "./dto/create-store.dto"
import { StoresService } from "./stores.service"
import { Store } from "./schemas/stores.schema"
import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	UseGuards,
	ParseIntPipe
} from "@nestjs/common"
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from "@nestjs/swagger"

@ApiTags("Stores")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stores")
export class StoresController {
	constructor(private readonly storesService: StoresService) {}

	@Get(":store_id")
	@ApiOperation({ summary: "Find Store" })
	@ApiOkResponse({ description: "The store details" })
	@ApiNotFoundResponse({ description: "The store is not found" })
	findOne(@Param("store_id") store_id: string): Promise<Store> {
		return this.storesService.findOne(store_id)
	}

	@Post()
	@ApiOperation({ summary: "Create Store" })
	@ApiCreatedResponse({ description: "The store created successfully" })
	create(@Body() storeDto: StoreDto): Promise<StoreResponse> {
		return this.storesService.create(storeDto)
	}

	//@Delete(':store_id')
	delete(@Param("store_id") store_id: string): Promise<Store> {
		return this.storesService.delete(store_id)
	}

	@Put(":store_id")
	@ApiOperation({ summary: "Update Store" })
	@ApiCreatedResponse({ description: "The store updated successfully" })
	update(
		@Body() storeDto: StoreDto,
		@Param("store_id") store_id: string
	): Promise<StoreResponse> {
		return this.storesService.update(store_id, storeDto)
	}
}
