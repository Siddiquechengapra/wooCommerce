import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { IsString, IsNumber } from "class-validator"

export type StoreSettingsDocument = StoreSettings & Document

export class StoreDetails {
	@IsString()
	store_id: string

	@IsString()
	logo: string

	@IsString()
	store_name: string

	@IsString()
	store_url: string
}
export class Colors {
	@IsNumber()
	badge_color: number

	@IsString()
	badge_text_color: string

	@IsString()
	primary_color: string

	@IsString()
	primary_color_dark: string
}

@Schema()
export class StoreSettings {
	@Prop()
	default_country: string

	@Prop()
	default_language: string

	@Prop()
	is_active: boolean

	@Prop()
	currency_code: string

	@Prop()
	colors: Colors

	@Prop()
	store_details: StoreDetails
}

export const StoreSettingsSchema = SchemaFactory.createForClass(StoreSettings)
