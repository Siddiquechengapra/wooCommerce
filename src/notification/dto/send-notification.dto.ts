import { ArrayMinSize, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

export class Message {
	@IsString()
	en: string
}

export class SendNotificationDto {
	@IsString()
	api_key: string

	@IsString()
	app_id: string

	@ArrayMinSize(1)
	@IsString({ each: true })
	included_segments: string[]

	@ValidateNested({ each: true })
	@Type(() => Message)
	contents: Message

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => Message)
	headings?: Message

	@IsBoolean()
	is_ios: boolean

	@IsBoolean()
	is_android: Boolean

	@IsOptional()
	@IsString()
	image_url?: string

	@IsOptional()
	@IsString()
	video_url?: string

	@IsOptional()
	@IsString()
	scheduled_at?: string

	@IsOptional()
	@IsString()
	link?: string
}
