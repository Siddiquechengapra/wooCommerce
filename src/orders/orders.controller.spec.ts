import { JwtGuardProvider, mockRequestObject } from "test/utils/setup"
import { AllOrdersDto } from "./dto/all-orders.dto"
import { OrdersController } from "./orders.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { OrdersService } from "./orders.service"
import { CustDto } from "./dto/orders.dto"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import * as mockOrderData from "test/data/mock-order-data.json"

const { order_id, order_status, currency_code, date_created_gmt, date_modified_gmt } = mockOrderData

describe("OrdersController", () => {
	let ordersController: OrdersController
	let orderService: OrdersService
	beforeEach(async () => {
		const ApiServiceProvider = {
			provide: OrdersService,
			useFactory: () => ({
				getAllOrder: jest.fn(() => ({
					orders: [
						{
							order_id: order_id,
							order_status: order_status,
							currency_code: currency_code,
							date_created_gmt: date_created_gmt,
							date_modified_gmt: date_modified_gmt
						}
					]
				})),
				getOrder: jest.fn(() => mockOrderData),
				cancelOrder: jest.fn(() => ({
					order_id: order_id,
					message: "Order Cancelled Successfully"
				})),
				createOrder: jest.fn(() => ({
					order_id: order_id,
					status: "processing",
					message: "Order Cancelled Successfully"
				})),
				updateOrder: jest.fn(() => ({
					order_id: order_id,
					status: "completed",
					message: "Order updated Successfully"
				}))
			})
		}

		const app: TestingModule = await Test.createTestingModule({
			controllers: [OrdersController],
			providers: [OrdersService, ApiServiceProvider, JwtGuardProvider]
		}).compile()

		ordersController = app.get<OrdersController>(OrdersController)

		orderService = app.get<OrdersService>(OrdersService)
	})

	it("should be defined", () => {
		expect(ordersController).toBeDefined()
	})

	describe("get all orders", () => {
		it("should return an array of order", async () => {
			const request = mockRequestObject()

			const orderDto = new AllOrdersDto()

			const getAllOrder = await ordersController.getAll(orderDto, request)

			expect(orderService.getAllOrder).toHaveBeenCalled()
			expect(orderService.getAllOrder).toHaveBeenCalledWith(orderDto, request)
			expect(getAllOrder).toEqual(
				expect.objectContaining({
					orders: expect.arrayContaining([
						expect.objectContaining({
							order_id: order_id,
							order_status: order_status,
							currency_code: currency_code,
							date_created_gmt: date_created_gmt,
							date_modified_gmt: date_modified_gmt
						})
					])
				})
			)
		})
	})

	describe("get order by id", () => {
		it("should return a order", async () => {
			const request = mockRequestObject()

			const orderDto = new CustDto()

			const getOrder = await ordersController.get(order_id, request, orderDto)

			expect(orderService.getOrder).toHaveBeenCalled()

			expect(orderService.getOrder).toHaveBeenCalledWith(order_id, request, orderDto)

			expect(getOrder).toEqual(expect.objectContaining(mockOrderData))
		})
	})

	describe("cancel order", () => {
		it("should return an array of order", async () => {
			const request = mockRequestObject()

			const orderDto = new CustDto()

			const cancelOrder = await ordersController.cancelOrder(order_id, request, orderDto)

			expect(orderService.cancelOrder).toHaveBeenCalled()
			expect(orderService.cancelOrder).toHaveBeenCalledWith(order_id, request, orderDto)
			expect(cancelOrder).toEqual(
				expect.objectContaining({
					order_id: order_id,
					message: "Order Cancelled Successfully"
				})
			)
		})
	})

	describe("create order", () => {
		it("should return the created order id ,status and message", async () => {
			const request = mockRequestObject()

			const createOrderDto = new CreateOrderDto()

			const createOrder = await ordersController.create(createOrderDto, request)

			expect(orderService.createOrder).toHaveBeenCalled()

			expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto, request)

			expect(createOrder).toEqual(
				expect.objectContaining({
					order_id: order_id,
					status: "processing",
					message: "Order Cancelled Successfully"
				})
			)
		})
	})

	describe("update order", () => {
		it("should return the updated order id ,status and message", async () => {
			const request = mockRequestObject()

			const updateOrderDto = new UpdateOrderDto()

			const updateOrder = await ordersController.update(updateOrderDto, order_id, request)

			expect(orderService.updateOrder).toHaveBeenCalled()

			expect(orderService.updateOrder).toHaveBeenCalledWith(updateOrderDto, order_id, request)

			expect(updateOrder).toEqual(
				expect.objectContaining({
					order_id: order_id,
					status: "completed",
					message: "Order updated Successfully"
				})
			)
		})
	})
})
