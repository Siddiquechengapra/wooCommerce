import { DataController } from "./data.controller"
import { DataService } from "./data.service"
import { Module } from "@nestjs/common"
import { UtilsModule } from "src/utils/utils.module"

@Module({
	imports: [UtilsModule],
	controllers: [DataController],
	providers: [DataService]
})
export class DataModule {}
