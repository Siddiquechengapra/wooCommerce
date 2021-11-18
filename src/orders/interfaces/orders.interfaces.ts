import { VajroOrder } from "./vajro-order.interface"

export interface AllOrders {
	orders: VajroOrder[]
}

export interface UpdateOrder {
	order_id: number
	status: string
	message: string
}

export interface CreateOrder {
	customer_id: string
	order_id: string
	order_status: string
}

export interface CancelOrder {
	order_id: number
	message: string
}
