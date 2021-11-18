import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { CartController } from "./cart.controller"
import { CartService } from "./cart.service"

@Module({
	imports: [forwardRef(() => UtilsModule)],
	controllers: [CartController],
	providers: [CartService]
})
export class CartModule {}
