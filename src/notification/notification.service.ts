import { Injectable, Inject, forwardRef, HttpException } from "@nestjs/common"
import { SendNotificationDto } from "./dto/send-notification.dto"
import { UtilsService } from "src/utils/utils.service"
import { HttpService } from "@nestjs/axios"
import { Request } from "express"

@Injectable()
export class NotificationService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService,
		private http: HttpService
	) {}

	async send(body: SendNotificationDto, req: Request): Promise<any> {
		const {
			api_key,
			app_id,
			included_segments,
			contents,
			headings,
			is_ios,
			is_android,
			link,
			scheduled_at
		} = body

		const url = "https://onesignal.com/api/v1/notifications"

		const options = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${api_key}`
			}
		}

		const send_after = scheduled_at ? scheduled_at : null

		const data = {
			app_id,
			included_segments,
			contents,
			headings,
			isIos: is_ios,
			isAndroid: is_android,
			app_url: link,
			send_after
		}

		const notifyReq = this.http.post(url, data, options).toPromise()

		const [notifyErr, notifyResp] = await this.utilsService.asyncWrapper(notifyReq)

		if (notifyErr) {
			const {
				status,
				data: { errors }
			} = notifyErr.response

			throw new HttpException({ message: errors, status }, status)
		}

		return { message: "Notification Sent Successfully", data: notifyResp.data }
	}
}
