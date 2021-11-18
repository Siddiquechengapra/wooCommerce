import { CartConfig, CartConfigDocument } from "src/config/schemas/cart-config.schema"
import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { PdpConfig, PdpConfigDocument } from "src/config/schemas/pdp-config.schema"
import { HomeConfig, HomeConfigDocument } from "./schemas/home-config.schema"
import { Config } from "src/config/interfaces/config.interface"
import { CustomException } from "src/custom-exception"
import { UtilsService } from "src/utils/utils.service"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

@Injectable()
export class ConfigService {
	constructor(
		@InjectModel("PdpConfig") private pdpConfigModel: Model<PdpConfigDocument>,
		@InjectModel("CartConfig") private cartConfigModel: Model<CartConfigDocument>,
		@InjectModel("HomeConfig") private homeConfigModel: Model<HomeConfigDocument>,
		@Inject(forwardRef(() => UtilsService)) public utilsService: UtilsService
	) {}

	async pdpConfig(store_id: string, version: string): Promise<PdpConfig> {
		const pdpConfig = await this.pdpConfigModel.findOne({ store_id, version, page_name: "pdp" })

		if (!pdpConfig) throw new NotFoundException(`Config not found`)

		return pdpConfig
	}

	async cartConfig(store_id: string, version: string): Promise<CartConfig> {
		const cartConfig = await this.cartConfigModel.findOne({
			store_id,
			version,
			page_name: "cart"
		})

		if (!cartConfig) throw new NotFoundException(`Config not found`)

		return cartConfig
	}

	async homeConfig(store_id: string, version: string): Promise<HomeConfig> {
		const homeConfigReq = this.homeConfigModel
			.findOne({ store_id, version, page_name: "home" })
			.exec()

		const [homeConfigErr, homeConfigRes] = await this.utilsService.asyncWrapper(homeConfigReq)

		if (homeConfigErr) {
			const { code, message } = homeConfigErr

			throw new CustomException({ message, code }, 500)
		}

		if (!homeConfigRes)
			throw new CustomException({ message: "No Config Found", code: "no_config_found" }, 404)

		return homeConfigRes
	}

	async updateConfig(config: Config): Promise<{ message: string }> {
		const { page_name, version, store_id } = config

		const availableModels = {
			pdp: this.pdpConfigModel,
			cart: this.cartConfigModel,
			home: this.homeConfigModel
		}

		const configModel = availableModels[page_name]

		if (!configModel)
			throw new CustomException(
				{ message: `Collection not found`, code: `collection_not_found` },
				404
			)

		const updateCollection = configModel.findOneAndUpdate(
			{ page_name, version, store_id },
			config,
			{ upsert: true }
		)

		const [configErr] = await this.utilsService.asyncWrapper(updateCollection)

		if (configErr) {
			const { code, message } = configErr

			throw new CustomException({ message, code }, 500)
		}

		return { message: "Config Updated Successfully" }
	}
}
