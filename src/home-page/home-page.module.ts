import { ProductsModule } from "src/products/products.module"
import { HomePageController } from "./home-page.controller"
import { HomePageService } from "./home-page.service"
import { ConfigModule } from "src/config/config.module"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"

@Module({
	imports: [
		forwardRef(() => UtilsModule),
		forwardRef(() => ConfigModule),
		forwardRef(() => ProductsModule)
	],
	controllers: [HomePageController],
	providers: [HomePageService]
})
export class HomePageModule {}
