import { Injectable } from "@nestjs/common"
import { ConfigDTO } from "src/dev-tools/dto/config-data.dto"
import { ConfigService } from "src/config/config.service"
import { Config } from "src/config/interfaces/config.interface"

@Injectable()
export class DevToolsService {
	constructor(private configService: ConfigService) {}
	extract(body: ConfigDTO): Config {
		const {
			version,
			page_name,
			store_id,
			config,
			header_widgets,
			scroll_widgets,
			footer_widgets
		} = body

		const final_scroll_widgets = scroll_widgets.map((widget: any) => {
			const { data, ...rest } = widget
			return rest
		})
		return {
			version,
			page_name,
			store_id,
			config,
			header_widgets,
			scroll_widgets: final_scroll_widgets,
			footer_widgets
		}
	}

	async update(body: ConfigDTO): Promise<any> {
		const newConfig = this.extract(body)

		const result = await this.configService.updateConfig(newConfig)

		return result
	}
}
