import { IsString } from "class-validator"

export class TokenAccessDto {
	@IsString()
	vajro_key: string

	@IsString()
	vajro_secret: string

	@IsString()
	store_id: string
}
