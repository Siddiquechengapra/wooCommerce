import { StoreSettings, StoreSettingsDocument } from "./schemas/store-settings.schema"
import { Injectable, Inject, forwardRef, HttpException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Request } from "express"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { CustomException } from "src/custom-exception"
import { UtilsService } from "src/utils/utils.service"

@Injectable()
export class StoreSettingsService {
	constructor(
		@InjectModel("StoreSettings") private storeSettingsModel: Model<StoreSettingsDocument>,
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	storeSettings(req: Request): Promise<StoreSettings | any> {
		const { store_id } = req.user as ReqUser
		const result = this.storeSettingsModel
			.findOne({
				"store_details.store_name": store_id
			})
			.then((doc) => {
				if (!doc) {
					throw new CustomException(
						{ message: "Store settings not found", code: "store_settings_not_found" },
						404
					)
				}
				return doc
			})
			.catch((err) => {
				throw new CustomException(
					{ message: err.message, code: "error_from_database" },
					404
				)
			})

		return result
	}
}
