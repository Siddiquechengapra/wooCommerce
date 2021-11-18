import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import { Injectable } from "@nestjs/common"
import { Discount } from "./interface/utils.interface"

@Injectable()
export class UtilsService {
	#ENCRYPTION_KEY: string

	constructor() {
		this.#ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
	}

	asyncWrapper(promise: Promise<any>): Promise<any> {
		return new Promise((resolve) => {
			promise.then((data) => resolve([null, data])).catch((err) => resolve([err]))
		})
	}

	encryptText(text: string) {
		const iv = randomBytes(16)

		const cipher = createCipheriv("aes-256-ctr", Buffer.from(this.#ENCRYPTION_KEY), iv)

		const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

		return iv.toString("hex") + ":" + encrypted.toString("hex")
	}

	decryptText(text: string) {
		const textParts = text.split(":")

		const iv = Buffer.from(textParts.shift(), "hex")

		const encryptedText = Buffer.from(textParts.join(":"), "hex")

		const decipher = createDecipheriv("aes-256-ctr", Buffer.from(this.#ENCRYPTION_KEY), iv)

		const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])

		return decrypted.toString()
	}

	widgetConfigAndData(configData, widgetsData) {
		const { config, header_widgets, scroll_widgets, footer_widgets } = configData

		const scrollWidgetWithData = scroll_widgets.map((widget) => {
			const { widget_name, store_data, ...rest } = widget

			const widgetData = widgetsData[widget_name]

			if (!widgetData) return { widget_name, ...rest }

			return { widget_name, ...rest, data: widgetData }
		})

		return {
			config,
			data: widgetsData["data"],
			header_widgets,
			scroll_widgets: scrollWidgetWithData,
			footer_widgets
		}
	}

	calculateDiscount(salePrice: string, regularPrice: string): Discount {
		if (!salePrice || !regularPrice) return { percent: null, value: null }

		const diffBtwRegAndSale = Number(regularPrice) - Number(salePrice)

		const diffByReg = diffBtwRegAndSale / Number(regularPrice)

		return { percent: Math.round(diffByReg * 100).toString(), value: diffBtwRegAndSale }
	}

	handleEmptyNumber(value: string): null | number {
		return value === "" ? null : Number(value)
	}

	valueOrNull(value: any): any {
		return value ? value : null
	}

	getUniqueObjectsByProp(array: any[], objProperty: string) {
		const unique = array
			// get the comparison property values
			.map((obj: any) => obj[objProperty])

			// get the indexes of the unique objects
			.map((elem, indx, arr) => arr.indexOf(elem) === indx && indx)

			// eliminate the false indexes
			.filter((elem) => array[elem])

			// return unique objects
			.map((elem) => array[elem])

		return unique
	}
}
