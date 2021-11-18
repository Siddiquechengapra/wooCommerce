import { HttpException } from "@nestjs/common"
interface Response {
	message: string
	code?: string
}

export class CustomException extends HttpException {
	constructor(response: Response, status: number) {
		super(response, status)
	}
}
