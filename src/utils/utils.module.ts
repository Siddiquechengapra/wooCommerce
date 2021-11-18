import { UtilsService } from "./utils.service"
import { Module } from "@nestjs/common"

@Module({
	imports: [],
	controllers: [],
	providers: [UtilsService],
	exports: [UtilsService]
})
export class UtilsModule {}
