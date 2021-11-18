import { CreateCustomerDto, CreatePaymentSheetDto, DecryptTextDTO } from "./dto/stripe-customer.dto"
import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { Request } from "express"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import Stripe from "stripe"
import { StoresService } from "../stores/stores.service"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

@Injectable()
export class PaymentService {
	private stripe: Stripe
	@Inject(forwardRef(() => StoresService))
	private storesService: StoresService

	constructor() {
		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: "2020-08-27"
		})
	}

	async createCustomer(body: CreateCustomerDto, req: Request): Promise<any> {
		const { store_id } = req.user as ReqUser
		const search_customer = await this.stripe.customers.list({
			email: body.email,
			limit: 3
		})
		if (search_customer.data.length > 0) {
			const customer = await this.stripe.customers.update(search_customer.data[0].id)

			const customer_data = {
				id: customer.id,
				currency: customer.currency,
				email: customer.email
			}
			const encrypted_customer = this.encryptText(JSON.stringify(customer_data), store_id)
			return encrypted_customer
		} else {
			const customer = await this.stripe.customers.create({
				email: body.email,
				description: "Customer is created at " + new Date(Date.now()).toLocaleString()
			})

			const customer_data = {
				id: customer.id,
				currency: customer.currency,
				email: customer.email
			}

			const encrypted_customer = this.encryptText(JSON.stringify(customer_data), store_id)
			return encrypted_customer
		}
	}

	async createSheet(body: CreatePaymentSheetDto, req: Request): Promise<any> {
		const { store_id } = req.user as ReqUser
		const { customer_id } = body
		const payment_intent = await this.stripe.paymentIntents.create({
			customer: customer_id,
			amount: parseInt(body.amount),
			currency: body.currency
		})
		const ephi_key = await this.stripe.ephemeralKeys.create(
			{ customer: customer_id },
			{ apiVersion: "2020-08-27" }
		)
		const keys = {
			client_secret: payment_intent.client_secret,
			ephimereal_key: ephi_key.id,
			customer: customer_id
		}
		const encrypted_payment = this.encryptText(JSON.stringify(keys), store_id)
		return encrypted_payment
	}

	async getKey(req: Request, store) {
		const { store_id } = req.user as ReqUser

		if (store_id === store) {
			return this.encryptText(process.env.STRIPE_PUBLISHABLE_KEY, store_id)
		} else {
			const message = "Invalid store details "
			const code = "could_not_fetch_publishable_key"
			const status = 422
			throw new HttpException({ message, code }, status)
		}
	}
	async encryptText(text: string, store_id: string) {
		const iv = randomBytes(16)
		const key = "8bb09b3cca3f85d310b226d08599e3a00e01c0986899d5b8d80cda32ac31e56e"
		const cipher = createCipheriv("aes-256-ctr", Buffer.from(key, "hex"), iv)
		const encrypted_val = Buffer.concat([cipher.update(text), cipher.final()])
		const encrypted_data = {
			value: iv.toString("hex") + ":" + encrypted_val.toString("hex")
		}
		return encrypted_data
	}

	async decryptText(body: DecryptTextDTO): Promise<any> {
		const { encryptedText } = body
		const iv = encryptedText.split(":")[0]
		const content = encryptedText.split(":")[1]
		const key = "8bb09b3cca3f85d310b226d08599e3a00e01c0986899d5b8d80cda32ac31e56e"
		const decipher = createDecipheriv(
			"aes-256-ctr",
			Buffer.from(key, "hex"),
			Buffer.from(iv, "hex")
		)
		const decrypted = Buffer.concat([
			decipher.update(Buffer.from(content, "hex")),
			decipher.final()
		])
		return decrypted.toString()
	}
}
