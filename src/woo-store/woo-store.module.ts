import { WooStoreController } from "./woo-store.controller"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { WooStoreService } from "./woo-store.service"

@Module({
	imports: [forwardRef(() => UtilsModule)],
	controllers: [WooStoreController],
	providers: [WooStoreService],
	exports: [WooStoreService]
})
export class WooStoreModule {}
