import { Body, Controller, Post } from "@nestjs/common"
import { DevToolsService } from "./dev-tools.service"
import { ConfigDTO } from "./dto/config-data.dto"
import { ApiTags } from "@nestjs/swagger"
import { Config } from "./interfaces/config.interface"

@ApiTags("Dev Tools")
@Controller("dev-tools")
export class DevToolsController {
	constructor(private readonly devToolsService: DevToolsService) {}

	@Post("/config/extract")
	extract(@Body() body: ConfigDTO): Config {
		return this.devToolsService.extract(body)
	}

	@Post("/config/update")
	update(@Body() body: ConfigDTO): any {
		return this.devToolsService.update(body)
	}
}
