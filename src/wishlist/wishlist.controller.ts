import { Body, Controller, Delete, Get, Post, Query, UseGuards, Req } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { FetchWishlistDto } from "./dto/fetch-wishlist.dto"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { WishlistService } from "./wishlist.service"
import { WishlistDto } from "./dto/wishlist.dto"
import { Request } from "express"

@ApiTags("Wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wishlist")
export class WishlistController {
	constructor(private readonly wishlistService: WishlistService) {}

	@Get("")
	@ApiOperation({ summary: "Get All Wishlists" })
	@ApiOkResponse({ description: "All Wishlists" })
	findAll(@Query() query: FetchWishlistDto, @Req() req: Request): Promise<any> {
		return this.wishlistService.findAll(query, req)
	}

	@Post("")
	@ApiOperation({ summary: "Add Wishlist" })
	@ApiOkResponse({ description: "Wishlist Added Successfully" })
	create(@Body() body: WishlistDto, @Req() req: Request): Promise<any> {
		return this.wishlistService.create(body, req)
	}

	@Delete("")
	@ApiOperation({ summary: "Delete Wishlist" })
	@ApiOkResponse({ description: "Wishlist Deleted Successfully" })
	delete(@Body() body: WishlistDto, @Req() req: Request): Promise<any> {
		return this.wishlistService.delete(body, req)
	}
}
