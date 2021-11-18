import { PdpConfigSchema } from "src/config/schemas/pdp-config.schema"
import { CartConfigSchema } from "src/config/schemas/cart-config.schema"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigService } from "src/config/config.service"
import { ConfigController } from "src/config/config.controller"
import { forwardRef, Module } from "@nestjs/common"
import { UtilsModule } from "src/utils/utils.module"
import { HomeConfigSchema } from "./schemas/home-config.schema"

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "PdpConfig", schema: PdpConfigSchema, collection: "pdp_config" },
			{ name: "CartConfig", schema: CartConfigSchema, collection: "cart_config" },
			{ name: "HomeConfig", schema: HomeConfigSchema, collection: "home_config" }
		]),
		forwardRef(() => UtilsModule)
	],
	controllers: [ConfigController],
	providers: [ConfigService],
	exports: [ConfigService]
})
export class ConfigModule {}
