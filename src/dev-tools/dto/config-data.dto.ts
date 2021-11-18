import { Type } from "class-transformer"
import {
	ArrayMinSize,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested
} from "class-validator"

export class Widgets {
	@IsString()
	widget_name: string

	@IsOptional()
	@IsNumber()
	position?: number

	@IsObject()
	config: Record<string, string | boolean | number>

	@IsOptional()
	@IsObject()
	data?: Record<string, string | number | []>
}
export class ConfigDTO {
	@IsString()
	version: string

	@IsString()
	page_name: string

	@IsString()
	store_id: string

	@IsObject()
	config: Record<string, string | number | []>

	@IsOptional()
	@IsObject()
	data?: Record<string, string | number | []>

	@ValidateNested({ each: true })
	@Type(() => Widgets)
	header_widgets: Widgets[]

	@ValidateNested({ each: true })
	@Type(() => Widgets)
	scroll_widgets: Widgets[]

	@ValidateNested({ each: true })
	@Type(() => Widgets)
	footer_widgets: Widgets[]
}
