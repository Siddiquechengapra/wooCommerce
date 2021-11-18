import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type HomeConfigDocument = HomeConfig & Document

export class Config {
	[key: string]: string
}

@Schema()
export class HomeConfig {
	@Prop()
	store_id: string

	@Prop()
	page_name: string

	@Prop()
	version: string

	@Prop()
	config: Config

	@Prop()
	header_widgets: any[]

	@Prop()
	scroll_widgets: any[]

	@Prop()
	footer_widgets: any[]
}

export const HomeConfigSchema = SchemaFactory.createForClass(HomeConfig)
