import { CategoriesController } from "./categories.controller"
import { CategoriesService } from "./categories.service"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"

@Module({
	imports: [forwardRef(() => UtilsModule)],
	controllers: [CategoriesController],
	providers: [CategoriesService]
})
export class CategoriesModule {}
