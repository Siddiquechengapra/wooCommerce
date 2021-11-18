import { IsNumber, IsString, IsEmail, IsOptional, IsNotEmpty } from "class-validator"
import { Type } from "class-transformer"

export class OrdersDto {
	@IsNotEmpty()
	customer_id?: number

	@IsOptional()
	order_status?: string

	@IsOptional()
	@Type(() => Number)
	page_no?: number

	@IsOptional()
	@Type(() => Number)
	per_page?: number

	@IsOptional()
	sort?: string

	@IsOptional()
	sort_by?: string
}

export class AllOrdersDto {
	@IsNotEmpty()
	@Type(() => Number)
	store_id: number
	@IsNotEmpty()
	customer: number

	@IsOptional()
	page_no?: number
	@IsOptional()
	per_page?: number
	@IsOptional()
	status?: string
}

export class OrderContactDetails {
	@IsString()
	first_name: string

	@IsString()
	last_name: string

	@IsString()
	address_1: string

	@IsString()
	address_2: string

	@IsString()
	city: string

	@IsString()
	state: string

	@IsString()
	zip: string

	@IsString()
	country: string

	@IsOptional()
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	phone: string
}

export class OrderLineItems {
	@IsString()
	product_name: string

	@IsString()
	product_id: string

	@IsString()
	variant_id: string

	@IsString()
	option_string: string

	@IsNumber()
	quantity: number

	@IsNumber()
	price: number

	@IsNumber()
	tax_value: number

	@IsString()
	tax_label: string
}

export class OrderTaxLines {
	@IsString()
	label: string

	@IsString()
	tax_total: string

	@IsString()
	shipping_tax_total: string
}

export class OrderShippingLines {
	@IsString()
	method: string

	@IsString()
	method_id: string

	@IsString()
	total: string
}

export class CustDto {
	@IsString()
	customer_id: string
}
