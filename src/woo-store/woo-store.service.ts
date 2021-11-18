import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { UtilsService } from "src/utils/utils.service"
import { SettingsDto } from "./dto/settings.dto"
import { Request } from "express"

@Injectable()
export class WooStoreService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async getWooStoreSettings(body: SettingsDto, req: Request): Promise<any> {
		const { WooCommerce } = req.user as ReqUser

		const { types } = body

		const settingsProm = types.map((type) => WooCommerce.get(`settings/${type}`, { type }))

		const settingsReq = Promise.all(settingsProm)

		const [error, responses] = await this.utilsService.asyncWrapper(settingsReq)

		if (error) {
			const { status, data } = error.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const settingsOptions = responses.reduce((acc: any, res: any) => {
			const { config, data } = res

			const type = config.params.type

			const setting = data.map((elem: any) => {
				return {
					id: elem.id || null,
					value: elem.value || null,
					options: elem.options || null
				}
			})

			acc[`${type}_setting`] = setting

			return acc
		}, {})

		return settingsOptions
	}
}
