import { CustomerDto, CustomerAddressDto, CreateCustomerDto } from "./dto/customer-details.dto"
import { HttpException, Injectable, forwardRef, Inject } from "@nestjs/common"
import { CustomerToken } from "./interfaces/customer-token.interface"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { CustomException } from "src/custom-exception"
import { UtilsService } from "src/utils/utils.service"
import {
	CustomerDetails,
	CustomerDeleteAddress,
	Customer,
	CustomerNoAddress,
	VajroCustomer,
	UpdatePasswordResponse,
	CreateCustomer
} from "./interfaces/vajro-customer.interface"
import { HttpService } from "@nestjs/axios"
import { AuthDto } from "./dto/auth.dto"
import { lastValueFrom } from "rxjs"
import { Request } from "express"
import * as customMessage from "./messages/custom-messages.json"
import * as FormData from "form-data"

@Injectable()
export class CustomersService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		private http: HttpService
	) {}

	async login(body: AuthDto, req: Request): Promise<CustomerToken> {
		const { WooCommerce } = req.user as ReqUser

		const { password, email } = body

		const domain = WooCommerce.url

		const authUrl = `${domain}/?rest_route=/simple-jwt-login/v1/auth&email=${email}&password=${password}`

		const loginReq = lastValueFrom(this.http.post(authUrl))

		const [loginErr] = await this.utilsService.asyncWrapper(loginReq)

		if (loginErr) {
			const { status } = loginErr.response

			const { message } = loginErr.response.data.data

			const code = "failure"

			throw new CustomException({ message, code }, status)
		}

		const request = WooCommerce.get(`customers?email=${email}`)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}

		const userdata = response.data

		return {
			customer_id: userdata[0].id,
			user_name: userdata[0].username,
			first_name: userdata[0].first_name,
			last_name: userdata[0].last_name,
			email: userdata[0].email,
			phone: userdata[0].billing.phone === "string" ? "" : userdata[0].billing.phone,
			message: customMessage.LOGIN_SUCCESS
		}
	}

	vajroCustomer(customer: any): VajroCustomer {
		return {
			id: customer.id,
			created_at: customer.date_created_gmt,
			updated_at: customer.date_modified_gmt,
			first_name: customer.first_name,
			last_name: customer.last_name,
			email: customer.email,
			address: [customer.billing, customer.shipping]
		}
	}

	async updatePassword(body: UpdatePasswordDto, req: Request): Promise<UpdatePasswordResponse> {
		const { WooCommerce } = req.user as ReqUser

		const { username, old_password, new_password, id } = body

		const domain = WooCommerce.url

		const authUrl = `${domain}/?rest_route=/simple-jwt-login/v1/auth&username=${username}&password=${old_password}`

		const loginReq = lastValueFrom(this.http.post(authUrl))

		const [loginErr] = await this.utilsService.asyncWrapper(loginReq)

		if (loginErr) {
			const { status } = loginErr.response

			const { message } = loginErr.response.data.data

			const code = "failure"

			throw new CustomException({ message, code }, status)
		}

		const customerReq = WooCommerce.put(`customers/${id}`, { password: new_password })

		const [customerErr] = await this.utilsService.asyncWrapper(customerReq)

		if (customerErr) {
			const { status } = customerErr.response

			const { message } = customerErr.response.data.data

			const code = "failure"

			throw new CustomException({ message, code }, status)
		}

		return {
			customer_id: id,
			user_name: username,
			message: customMessage.UPDATE_PASSWORD_SUCCESS
		}
	}

	async addCustomer(body: CreateCustomerDto, req: Request): Promise<CreateCustomer> {
		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.post("customers", body)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			let { status, data } = err.response

			let { code, message } = data

			message = message.split(".")[0]

			if (code === "registration-error-email-exists") {
				status = 409
			}

			throw new CustomException({ message, code }, status)
		}

		const custData: CreateCustomer = {
			customer_id: response.data.id,
			user_name: response.data.username,
			first_name: response.data.first_name,
			last_name: response.data.last_name,
			email: response.data.email,
			message: customMessage.CREATE_CUSTOMER_SUCCESS
		}

		return custData
	}

	async findCustomer(query: CustomerDto, req: Request): Promise<Customer | CustomerNoAddress> {
		const { cust_id } = query

		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.get(`customers/${cust_id}`)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const responseData = [
			response.data.billing.first_name,
			response.data.billing.last_name,
			response.data.billing.address_1,
			response.data.billing.address_2,
			response.data.billing.city,
			response.data.billing.country,
			response.data.billing.state,
			response.data.billing.email,
			response.data.billing.postcode,
			response.data.billing.phone
		]

		const allEqualFun = (arr: any) => arr.every((val: any) => val === "")

		const allEqual = allEqualFun(responseData)

		const contact = {
			first_name: response.data.billing.first_name,
			last_name: response.data.billing.last_name,
			address_1: response.data.billing.address_1,
			address_2: response.data.billing.address_2,
			city: response.data.billing.city,
			country: response.data.billing.country,
			state: response.data.billing.state,
			zip_code: response.data.billing.postcode,
			phone_number: response.data.billing.phone
		}

		const customer: Customer | CustomerNoAddress = allEqual
			? {
					customer_id: response.data.id,
					first_name: response.data.first_name,
					last_name: response.data.last_name,
					email: response.data.email,
					username: response.data.username,
					phone: response.data.billing.phone
			  }
			: {
					customer_id: response.data.id,
					first_name: response.data.first_name,
					last_name: response.data.last_name,
					email: response.data.email,
					username: response.data.username,
					phone: response.data.billing.phone,
					contact_details: contact
			  }

		return customer
	}

	async updateCustomer(
		body: CustomerAddressDto,
		query: CustomerDto,
		req: Request
	): Promise<CustomerDetails> {
		const { cust_id } = query

		const data = {
			first_name: body.contact_details.first_name,
			last_name: body.contact_details.last_name,

			billing: {
				first_name: body.contact_details.first_name,
				last_name: body.contact_details.last_name,
				address_1: body.contact_details.address_1,
				address_2: body.contact_details.address_2,
				city: body.contact_details.city,
				state: body.contact_details.state,
				postcode: body.contact_details.zip_code,
				country: body.contact_details.country,
				phone: body.contact_details.phone_number
			},
			shipping: {
				first_name: body.contact_details.first_name,
				last_name: body.contact_details.last_name,
				address_1: body.contact_details.address_1,
				address_2: body.contact_details.address_2,
				city: body.contact_details.city,
				state: body.contact_details.state,
				postcode: body.contact_details.zip_code,
				country: body.contact_details.country,
				phone: body.contact_details.phone_number
			}
		}

		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.put(`customers/${cust_id}`, data)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const customer: CustomerDetails = {
			customer_id: response.data.id,
			user_name: response.data.username,
			first_name: response.data.first_name,
			last_name: response.data.last_name,
			email: response.data.email,
			phone: response.data.billing.phone === "string" ? "" : response.data.billing.phone,
			message: customMessage.UPDATE_CUSTOMER_SUCCESS
		}

		return customer
	}

	async deleteAddress(req: Request, query): Promise<CustomerDeleteAddress> {
		const { cust_id } = query

		const data = {
			billing: {
				first_name: "",
				last_name: "",
				address_1: "",
				address_2: "",
				company: "",
				city: "",
				state: "",
				postcode: "",
				country: "",
				phone: ""
			},
			shipping: {
				first_name: "",
				last_name: "",
				address_1: "",
				address_2: "",
				company: "",
				city: "",
				state: "",
				postcode: "",
				country: "",
				phone: ""
			}
		}

		const { WooCommerce } = req.user as ReqUser

		const request = WooCommerce.put(`customers/${cust_id}`, data)

		const [err, response] = await this.utilsService.asyncWrapper(request)

		if (err) {
			const { status, data } = err.response

			const { code, message } = data

			throw new HttpException({ message, code }, status)
		}

		const customer: CustomerDeleteAddress = {
			customer_id: response.data.id,
			message: customMessage.DELETE_ADDRESS_SUCCESS
		}

		return customer
	}
	async resetPassword(query: ResetPasswordDto, req: Request): Promise<any> {
		const { WooCommerce } = req.user as ReqUser
		const { email } = query
		const request = WooCommerce.get(`customers?email=${email}`)
		const [error, response] = await this.utilsService.asyncWrapper(request)
		if (error) {
			const { status, data } = error.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}

		if (response.data.length === 0) {
			throw new CustomException({ message: " Email is not regstered", code: "failure" }, 404)
		}
		const form = new FormData()

		form.append("user_login", email)

		const lostPageUrl = `${WooCommerce.url}/wp-login.php?action=lostpassword`

		const options = { headers: form.getHeaders() }

		const loginReq = lastValueFrom(this.http.post(lostPageUrl, form, options))

		const [err, res] = await this.utilsService.asyncWrapper(loginReq)

		if (err) {
			const { status, data } = error.response

			const { code, message } = data

			throw new CustomException({ message, code }, status)
		}
		return {
			message: "Check your email for the reset password link"
		}
	}
}
