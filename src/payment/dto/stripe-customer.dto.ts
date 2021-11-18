export class CreateCustomerDto {
	email: string
}
export class CreatePaymentSheetDto {
	customer_id: string
	amount: string
	currency: string
}
export class StoreData {
	store_id: string
}

export class DecryptTextDTO {
	encryptedText: string
}
