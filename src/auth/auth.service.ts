import { Injectable, Inject, forwardRef, BadRequestException } from "@nestjs/common"
import { AccessToken } from "./interfaces/access-token.interface"
import { StoresService } from "../stores/stores.service"
import { UtilsService } from "../utils/utils.service"
import { TokenAccessDto } from "./dto/token-access.dto"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => StoresService))
		private storesService: StoresService,
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		private jwtService: JwtService
	) {}

	async getToken(body: TokenAccessDto): Promise<AccessToken> {
		const { store_id, vajro_key, vajro_secret } = body

		const store = await this.storesService.findOne(store_id)

		const { vajro_key: dbVajroKey, vajro_secret: dbVajroSecret } = store

		if (vajro_key !== dbVajroKey) throw new BadRequestException("Invalid Vajro Key")

		if (vajro_secret !== dbVajroSecret) throw new BadRequestException("Invalid Vajro Secret")

		const encryptedStoreId = this.utilsService.encryptText(`${store_id}`)

		const payload = { sub: encryptedStoreId }

		const token = this.jwtService.sign(payload)

		return { access_token: token, token_type: "Bearer", expires_in: 86400 }
	}
}
