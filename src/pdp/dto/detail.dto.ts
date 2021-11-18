import { IsString } from "class-validator"

export class DetailDto {
	@IsString()
	prod_id: string
}
