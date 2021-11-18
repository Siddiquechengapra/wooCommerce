import { WishlistController } from "./wishlist.controller"
import { WishlistService } from "./wishlist.service"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"

@Module({
	imports: [forwardRef(() => UtilsModule)],
	controllers: [WishlistController],
	providers: [WishlistService]
})
export class WishlistModule {}
