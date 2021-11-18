import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { ReqUser } from "./interfaces/req-user.interface"
import { StoresService } from "../stores/stores.service"
import { UtilsService } from "../utils/utils.service"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private storesService: StoresService, private utilsService: UtilsService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		})
	}

	async validate(payload: JwtPayload): Promise<ReqUser> {
		const encryptedStoreId = payload.sub

		const store_id = this.utilsService.decryptText(encryptedStoreId)

		const WooCommerce = await this.storesService.fetchStoreWooApi(store_id)

		return { store_id: store_id, WooCommerce: WooCommerce }
	}
}
