import { IsNumber, IsString } from "class-validator"

export class StoreDto {
	@IsString()
	name: string

	@IsString()
	domain: string

	@IsString()
	consumer_key: string

	@IsString()
	consumer_secret: string
}
