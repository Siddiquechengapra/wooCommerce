import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Controller, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { ConfigService } from "./config.service"

@ApiTags("Config")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("config")
export class ConfigController {
	constructor(private readonly configService: ConfigService) {}
}
