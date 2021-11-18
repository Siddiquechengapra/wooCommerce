import { ConfigModule, ConfigService } from "@nestjs/config"
import { StoresModule } from "../stores/stores.module"
import { UtilsModule } from "src/utils/utils.module"
import { Module, forwardRef } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { JwtModule } from "@nestjs/jwt"

@Module({
	imports: [
		forwardRef(() => StoresModule),
		forwardRef(() => UtilsModule),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: { expiresIn: "24h" }
			}),
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
