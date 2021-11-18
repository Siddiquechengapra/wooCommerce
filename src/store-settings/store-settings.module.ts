import { StoreSettingsSchema } from "./schemas/store-settings.schema"
import { StoreSettingsController } from "./store-settings.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { StoreSettingsService } from "./stores-settings.service"
import { Module } from "@nestjs/common"
import { forwardRef } from "@nestjs/common"
import { UtilsModule } from "src/utils/utils.module"

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "StoreSettings", schema: StoreSettingsSchema, collection: "store_setting" }
		]),
		forwardRef(() => UtilsModule)
	],
	controllers: [StoreSettingsController],
	providers: [StoreSettingsService],
	exports: [StoreSettingsService]
})
export class StoreSettingsModule {}
