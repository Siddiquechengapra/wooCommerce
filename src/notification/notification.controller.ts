import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common"
import { SendNotificationDto } from "./dto/send-notification.dto"
import { NotificationService } from "./notification.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { Request } from "express"

@ApiTags("Notification")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notification")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Post()
	@ApiOperation({ summary: "Send Notification" })
	@ApiOkResponse({ description: "Notification sent" })
	send(@Body() body: SendNotificationDto, @Req() req: Request): Promise<any> {
		return this.notificationService.send(body, req)
	}
}
