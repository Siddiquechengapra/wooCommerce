import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type PdpConfigDocument = PdpConfig & Document

export class Config {
	[key: string]: string
}

@Schema()
export class PdpConfig {
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

export const PdpConfigSchema = SchemaFactory.createForClass(PdpConfig)
