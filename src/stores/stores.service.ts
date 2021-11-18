import { StoreResponse } from "./interfaces/store-response.interface"
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { Store, StoreDocument } from "./schemas/stores.schema"
import { UtilsService } from "src/utils/utils.service"
import { StoreDto } from "./dto/create-store.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { nanoid } from "nanoid"
import {
	Injectable,
	Inject,
	forwardRef,
	HttpException,
	NotFoundException,
	InternalServerErrorException,
	HttpStatus
} from "@nestjs/common"

@Injectable()
export class StoresService {
	constructor(
		@InjectModel("Store") private storeModel: Model<StoreDocument>,
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async findOne(store_id: string): Promise<Store> {
		const store = await this.storeModel.findOne({ store_id })

		if (!store) {
			throw new HttpException(
				{ message: `store_with_id_${store_id} _not_found`, code: HttpStatus.NOT_FOUND },
				HttpStatus.NOT_FOUND
			)
		}

		return store
	}

	async fetchStoreWooApi(store_id: string): Promise<WooCommerceRestApi> {
		const store = await this.storeModel.findOne({ store_id })

		if (!store) {
			throw new NotFoundException(`Store with id ${store_id} not found`)
		}

		const { domain, consumer_key, consumer_secret } = store

		const wooCommerce = new WooCommerceRestApi({
			url: domain,
			consumerKey: consumer_key,
			consumerSecret: consumer_secret,
			queryStringAuth: true
		})

		return wooCommerce
	}

	async create(store: StoreDto): Promise<StoreResponse> {
		const storeId = nanoid(11)

		const newStore = new this.storeModel({ ...store, store_id: storeId })

		const [err, response] = await this.utilsService.asyncWrapper(newStore.save())

		if (err) {
			const { code } = err

			if (code === 11000) console.log("Store Id Already Exists")

			throw new InternalServerErrorException(err)
		}

		return {
			store_id: response.store_id,
			status: "Success",
			message: "Store created successfully"
		}
	}

	async delete(store_id: string): Promise<Store> {
		return await this.storeModel.findByIdAndRemove(store_id)
	}

	async update(store_id: string, store: StoreDto): Promise<StoreResponse> {
		const updateReq = await this.storeModel.findOneAndUpdate({ store_id }, store, {
			new: true
		})

		return {
			store_id: updateReq.store_id,
			status: "Success",
			message: "Store updated successfully"
		}
	}
}
