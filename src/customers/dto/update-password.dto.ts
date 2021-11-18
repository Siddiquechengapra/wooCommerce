import { IsNumber, IsString } from "class-validator"

export class UpdatePasswordDto {
	@IsNumber()
	id: number

	@IsString()
	username: string

	@IsString()
	old_password: string

	@IsString()
	new_password: string
}
