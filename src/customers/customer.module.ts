import { CustomersController } from "./customer.controller"
import { StoresModule } from "src/stores/stores.module"
import { CustomersService } from "./customer.service"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"

@Module({
	imports: [forwardRef(() => StoresModule), forwardRef(() => UtilsModule), HttpModule],
	controllers: [CustomersController],
	providers: [CustomersService]
})
export class CustomersModule {}
