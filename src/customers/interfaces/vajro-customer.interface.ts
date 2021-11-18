export interface Billing {
	first_name: string
	last_name: string
	company: string
	address_1: string
	address_2: string
	city: string
	state: string
	postcode: string
	country: string
	email: string
	phone: string
}

export interface Shipping {
	first_name: string
	last_name: string
	company: string
	address_1: string
	address_2: string
	city: string
	state: string
	postcode: string
	country: string
	email: string
}
export interface Media {
	type: string
	src: string
}

export interface VajroCustomer {
	id: number
	created_at: Date
	updated_at: Date
	first_name: string
	last_name: string
	email: string
	address: [Billing, Shipping]
}

export interface CustomerDetails {
	customer_id: number
	user_name: string
	first_name: string
	last_name: string
	email: string
	phone: string
	message: string
}

export interface CreateCustomer {
	customer_id: number
	user_name: string
	first_name: string
	last_name: string
	email: string
	message: string
}

export interface UpdatePasswordResponse {
	customer_id: number
	user_name: string
	message: string
}
export interface CustomerDeleteAddress {
	customer_id: number
	message: string
}

export interface Customer {
	customer_id: string
	first_name: string
	last_name: string
	email: string
	username: string
	contact_details?: Contact
}

export interface CustomerNoAddress {
	customer_id: string
	first_name: string
	last_name: string
	email: string
	username: string
	phone: string
}

export interface Contact {
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
