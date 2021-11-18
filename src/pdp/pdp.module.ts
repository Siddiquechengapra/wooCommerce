import { UtilsModule } from "src/utils/utils.module"
import { ConfigModule } from "src/config/config.module"
import { PdpController } from "./pdp.controller"
import { PdpService } from "./pdp.service"
import { Module, forwardRef } from "@nestjs/common"

@Module({
	imports: [forwardRef(() => UtilsModule), forwardRef(() => ConfigModule)],
	controllers: [PdpController],
	providers: [PdpService],
	exports: [PdpService]
})
export class PdpModule {}
