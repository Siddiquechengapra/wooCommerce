import { ArrayMinSize, IsString } from "class-validator"

export class SettingsDto {
	@ArrayMinSize(1)
	@IsString({ each: true })
	types: string[]
}
