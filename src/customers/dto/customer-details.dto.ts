import { IsString, IsNotEmpty, IsEmail } from "class-validator"
import { Type } from "class-transformer"

//To create Customer
export class CustomerDetailDto {
	@IsNotEmpty()
	@IsString()
	readonly first_name: string

	@IsNotEmpty()
	@IsString()
	readonly last_name: string

	@IsNotEmpty()
	@IsString()
	readonly username: string

	@IsNotEmpty()
	@IsEmail()
	readonly email: string

	@IsNotEmpty()
	readonly password: string

	readonly billing: BillingT
}

export class CreateCustomerDto {
	@IsNotEmpty()
	@IsString()
	readonly first_name: string

	@IsNotEmpty()
	@IsString()
	readonly last_name: string

	@IsNotEmpty()
	@IsString()
	readonly username: string

	@IsNotEmpty()
	@IsEmail()
	readonly email: string

	@IsNotEmpty()
	readonly password: string
}

export class BillingT {
	@IsString()
	readonly phone: string
}

export class CustomerDto {
	@IsNotEmpty()
	@Type(() => Number)
	cust_id: number
}

export class billingT {
	first_name: string
	last_name: string
	address_1: string
	address_2: string
	city: string
	country: string
	state: string
	zip_code: string
	phone_number: string
}
export class CustomerAddressDto {
	contact_details: billingT
}
