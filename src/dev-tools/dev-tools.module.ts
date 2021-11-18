import { Module } from "@nestjs/common"
import { DevToolsService } from "src/dev-tools/dev-tools.service"
import { DevToolsController } from "src/dev-tools/dev-tools.controller"
import { ConfigModule } from "src/config/config.module"

@Module({
	imports: [ConfigModule],
	controllers: [DevToolsController],
	providers: [DevToolsService]
})
export class DevToolsModule {}
