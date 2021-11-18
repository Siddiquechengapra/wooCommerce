import { NotificationController } from "./notification.controller"
import { NotificationService } from "./notification.service"
import { StoresModule } from "src/stores/stores.module"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"

@Module({
	imports: [forwardRef(() => StoresModule), forwardRef(() => UtilsModule), HttpModule],
	controllers: [NotificationController],
	providers: [NotificationService]
})
export class NotificationModule {}
