import { Injectable, HttpException } from "@nestjs/common"
import { CountryListT, CountryResponseT } from "./interfaces/countries.interface"
import { UtilsService } from "src/utils/utils.service"
import { Request } from "express"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { StateListDto } from "./dto/states.dto"
import { StateListT, StatesT, StateResponseT } from "./interfaces/states.interface"
import { CurrencyT, CurrencyResponseT } from "./interfaces/currencies.interface"

@Injectable()
export class DataService {
	constructor(private utilsService: UtilsService) {}

	async findCountry(req: Request): Promise<CountryResponseT> {
		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.get(`data/countries`)
		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ code, message }, status)
		}

		const countries: CountryListT = response.data.map((country) => ({
			code: country.code,
			name: country.name,
			states: country.states
		}))

		return {
			countries: countries
		}
	}

	async findState(req: Request, query: StateListDto): Promise<StateResponseT> {
		const { WooCommerce } = req.user as ReqUser
		const { country_id } = query

		const request = WooCommerce.get(`data/countries/${country_id}`)
		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ code, message }, status)
		}

		const state: StatesT[] = response.data.states.map((state) => ({
			code: state.code,
			name: state.name
		}))

		const states: StateListT = {
			code: response.data.code,
			name: response.data.name,
			state: state
		}

		return {
			states: states
		}
	}
	async findCurrencies(req: Request): Promise<CurrencyResponseT> {
		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.get(`data/currencies`)
		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ code, message }, status)
		}

		const currencies: CurrencyT = response.data.map((currency) => ({
			code: currency.code,
			name: currency.name,
			symbol: currency.symbol
		}))

		return {
			currencies: currencies
		}
	}
	async findCurrency(req: Request, currency_name): Promise<CurrencyT> {
		const { WooCommerce } = req.user as ReqUser
		const request = WooCommerce.get(`data/currencies/${currency_name}`)
		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ code, message }, status)
		}

		const currency: CurrencyT = {
			code: response.data.code,
			name: response.data.name,
			symbol: response.data.symbol
		}

		return currency
	}
}
