import { IsString } from "class-validator"

export class PdpDto {
	@IsString()
	prod_id: string
}
