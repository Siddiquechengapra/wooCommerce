import { WooStoreModule } from "src/woo-store/woo-store.module"
import { ProductsModule } from "src/products/products.module"
import { CheckoutController } from "./checkout.controller"
import { CheckoutService } from "./checkout.service"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { PdpModule } from "src/pdp/pdp.module"

@Module({
	imports: [
		forwardRef(() => UtilsModule),
		forwardRef(() => ProductsModule),
		forwardRef(() => WooStoreModule),
		forwardRef(() => PdpModule)
	],
	controllers: [CheckoutController],
	providers: [CheckoutService]
})
export class CheckoutModule {}
