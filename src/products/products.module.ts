import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { PdpModule } from "src/pdp/pdp.module"

@Module({
	imports: [forwardRef(() => UtilsModule), forwardRef(() => PdpModule)],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService]
})
export class ProductsModule {}
