import { Injectable, Inject, forwardRef } from "@nestjs/common"
import { ReqUser } from "src/auth/interfaces/req-user.interface"
import { catDto } from "./dto/list-categories.dto"
import { UtilsService } from "src/utils/utils.service"
import { Request } from "express"

@Injectable()
export class CategoriesService {
	constructor(
		@Inject(forwardRef(() => UtilsService))
		private utilsService: UtilsService
	) {}

	async listCats(query: catDto, req: Request): Promise<any> {
		const { WooCommerce } = req.user as ReqUser
		const { parent, per_page = 50, orderby = "count", category_id } = query
		const params = {
			parent: parent,
			per_page: per_page,
			orderby: orderby
		}
		const options = JSON.parse(JSON.stringify(params))
		const result = await WooCommerce.get("products/categories", options)
		if (!result) {
			return {
				error: "error while accessing products/categories "
			}
		}
		const catTreeCreate = (value) => {
			var tree = []
			let item = result.data.filter((cat) => cat.id === Number(value))[0]
			tree.push(`${item.id}(${item.name}):${item.count}`)
			const cattree = (id) => {
				let iteration = result.data.filter((item) => item.parent === Number(id))
				if (iteration.length > 0) {
					tree.push(`${iteration[0].id}(${iteration[0].name}):${iteration[0].count}`)
					if (iteration[0] && iteration[0].parent !== 0) {
						cattree(iteration[0].id)
					}
				} else {
					return {
						result: `No child for ${
							result.data.filter((item) => item.id === Number(id))[0].name
						}`
					}
				}
			}
			cattree(value)
			return tree.join("=>")
		}
		let last = result.data.map((cat) => catTreeCreate(cat.id))
		return {
			CategoryData: last
		}
	}
}
