import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Controller, Get } from "@nestjs/common"

@ApiTags("Health Check")
@Controller()
export class AppController {
	constructor() {}

	@Get("/health")
	@ApiOperation({ summary: "Health Check" })
	@ApiOkResponse({ description: "The app is running" })
	healthCheck() {
		return "OK"
	}
}
