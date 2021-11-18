import { Type } from "class-transformer"
import { IsString, IsNumber, IsBoolean, ValidateNested, ArrayMinSize } from "class-validator"
import { OrderLineItems, OrderContactDetails } from "./orders.dto"

export class UpdateOrderDto {
	@IsString()
	customer_id: string

	@IsNumber()
	order_id: number

	@IsBoolean()
	set_paid: boolean

	@IsNumber()
	order_grand_total: number

	@IsString()
	currency_code: string

	@IsString()
	order_status: string

	@IsString()
	order_note: string

	@IsString()
	payment_method_id: string

	@IsString()
	payment_method_label: string

	@IsString()
	shipping_method_id: string

	@IsString()
	shipping_method_label: string

	@IsNumber()
	shipping_method_value: number

	@IsString()
	discount_id: string

	@IsString()
	discount_label: string

	@IsNumber()
	discount_value: number

	@IsString()
	tax_label: string

	@IsNumber()
	tax_value: number

	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => OrderLineItems)
	products: OrderLineItems[]

	@ValidateNested({ each: true })
	@Type(() => OrderContactDetails)
	shipping_address: OrderContactDetails

	@ValidateNested({ each: true })
	@Type(() => OrderContactDetails)
	billing_address: OrderContactDetails
}
