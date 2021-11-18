import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import * as helmet from "helmet"

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
	use(request: Request, response: Response, next: NextFunction): void {
		helmet()(request, response, next)
	}
}
