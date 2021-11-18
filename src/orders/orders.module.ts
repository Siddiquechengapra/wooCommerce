import { OrdersController } from "./orders.controller"
import { StoresModule } from "src/stores/stores.module"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { OrdersService } from "./orders.service"

@Module({
	imports: [forwardRef(() => StoresModule), forwardRef(() => UtilsModule)],
	controllers: [OrdersController],
	providers: [OrdersService]
})
export class OrdersModule {}
