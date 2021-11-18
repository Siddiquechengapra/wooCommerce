import { CouponsController } from "./coupons.controller"
import { CouponsService } from "./coupons.service"
import { Module } from "@nestjs/common"
import { UtilsModule } from "src/utils/utils.module"

@Module({
	imports: [UtilsModule],
	controllers: [CouponsController],
	providers: [CouponsService]
})
export class CouponsModule {}
