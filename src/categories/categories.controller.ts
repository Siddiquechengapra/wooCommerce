import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ProductsResponse } from "./interfaces/vajro-product.interface"
import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { catDto } from "./dto/list-categories.dto"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { CategoriesService } from "./categories.service"
import { Request } from "express"

@ApiTags("Category")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("category")
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get("")
	@ApiOperation({ summary: "List category tree" })
	@ApiOkResponse({ description: "Tree is printed" })
	search(@Query() query: catDto, @Req() req: Request): Promise<ProductsResponse> {
		return this.categoriesService.listCats(query, req)
	}
}