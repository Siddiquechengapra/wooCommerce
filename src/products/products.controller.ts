import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ProductsResponse } from "./interfaces/vajro-product.interface"
import { Controller, Get, Query, Req, UseGuards, Body } from "@nestjs/common"
import { Attributes } from "./interfaces/attributes.interface"
import { SearchProductsDto } from "./dto/search-products.dto"
import { ListProductsDto } from "./dto/list-products.dto"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { ProductsService } from "./products.service"
import { Request } from "express"
import { SearchProductResponse } from "./interfaces/search-product.interface"

@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get("/search")
	@ApiOperation({ summary: "Search Products" })
	@ApiOkResponse({ description: "The found products" })
	search(@Query() query: SearchProductsDto, @Req() req: Request): Promise<SearchProductResponse> {
		return this.productsService.searchProducts(query, req)
	}

	@Get("/list")
	@ApiOperation({ summary: "List Products" })
	@ApiOkResponse({ description: "The found products" })
	list(@Query() query: ListProductsDto, @Req() req: Request): Promise<ProductsResponse> {
		return this.productsService.listProducts(query, req)
	}

	@Get("attributes")
	@ApiOperation({ summary: "Products Attributes & Terms" })
	@ApiOkResponse({ description: "The Products Attributes & Terms" })
	attributes(@Req() req: Request): Promise<Attributes[]> {
		return this.productsService.getAttributes(req)
	}
}
