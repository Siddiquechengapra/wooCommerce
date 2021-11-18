import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common"

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
	private logger = new Logger("Internal Server Error")

	catch(exception: unknown, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse()

		const httpException = exception instanceof HttpException

		if (httpException) {
			const status = exception.getStatus()

			const { code, message }: any = exception.getResponse()

			response.status(status).json({
				message: message,
				code: code
			})
		} else {
			const message = exception instanceof Error && exception.message

			const stack = exception instanceof Error && exception.stack

			this.logger.error(message, stack)

			response.status(500).json({
				message: message,
				code: "internal_server_error"
			})
		}
	}
}
