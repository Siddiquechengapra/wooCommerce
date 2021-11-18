import { AccessToken } from "./interfaces/access-token.interface"
import { TokenAccessDto } from "./dto/token-access.dto"
import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("Admin")
@Controller("admin")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/tokens/access")
	async createToken(@Body() body: TokenAccessDto): Promise<AccessToken> {
		return this.authService.getToken(body)
	}
}
