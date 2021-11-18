import { Module, forwardRef } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { StoresController } from "./stores.controller"
import { StoresService } from "./stores.service"
import { StoreSchema } from "./schemas/stores.schema"
import { UtilsModule } from "src/utils/utils.module"

@Module({
	imports: [
		MongooseModule.forFeature([{ name: "Store", schema: StoreSchema, collection: "store" }]),
		forwardRef(() => UtilsModule)
	],
	controllers: [StoresController],
	providers: [StoresService],
	exports: [StoresService]
})
export class StoresModule {}
