import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type StoreDocument = Store & Document

@Schema()
export class Store {
	@Prop({
		required: true,
		unique: true
	})
	store_id: string

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	domain: string

	@Prop({ required: true })
	consumer_key: string

	@Prop({ required: true })
	consumer_secret: string

	@Prop()
	vajro_key: string

	@Prop()
	vajro_secret: string
}

export const StoreSchema = SchemaFactory.createForClass(Store)
