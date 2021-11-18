export interface CustomerToken {
	customer_id: string
	user_name: string
	first_name: string
	last_name: string
	email: string
	phone: string
	message: string
}

export interface Error {
	status: number
	message: string
	code: number
}
