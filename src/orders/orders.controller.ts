import { Controller, Get, Post, Query, UseGuards, Body, Put, Param, Req } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { AllOrders, CreateOrder, UpdateOrder, CancelOrder } from "./interfaces/orders.interfaces"
import { VajroOrder } from "./interfaces/vajro-order.interface"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { CustDto } from "./dto/orders.dto"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AllOrdersDto } from "./dto/all-orders.dto"
import { OrdersService } from "./orders.service"
import { Request } from "express"

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Get()
	@ApiOperation({ summary: "Get All orders" })
	@ApiOkResponse({ description: "The list of orders" })
	getAll(@Query() query: AllOrdersDto, @Req() req: Request): Promise<AllOrders> {
		return this.ordersService.getAllOrder(query, req)
	}

	@Get(":order_id")
	@ApiOperation({ summary: "Get orders by id" })
	@ApiOkResponse({ description: "The found order" })
	get(
		@Param("order_id") order_id: number,
		@Req() req: Request,
		@Query() query: CustDto
	): Promise<VajroOrder> {
		return this.ordersService.getOrder(order_id, req, query)
	}

	@Post()
	@ApiOperation({ summary: "Create order" })
	@ApiOkResponse({ description: "Order created" })
	create(@Body() body: CreateOrderDto, @Req() req: Request): Promise<CreateOrder> {
		return this.ordersService.createOrder(body, req)
	}

	@Put("")
	@ApiOperation({ summary: "Update order" })
	@ApiOkResponse({ description: "The order updated successfully" })
	update(@Body() body: UpdateOrderDto, @Req() req: Request): Promise<UpdateOrder> {
		return this.ordersService.updateOrder(body, req)
	}

	@Put("cancel/:order_id")
	@ApiOperation({ summary: "Cancel order by id" })
	@ApiOkResponse({ description: "Order found and cancelled" })
	async cancelOrder(
		@Param("order_id") order_id: number,
		@Req() req: Request,
		@Query() query: CustDto
	): Promise<CancelOrder> {
		return await this.ordersService.cancelOrder(order_id, req, query)
	}
}
