import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { CustomExceptionFilter } from "./custom-exception-filter"

//Commented out as it is causing issue in the AWS environment
//require('appmetrics-dash').attach()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix("/api/v1")

	app.useGlobalFilters(new CustomExceptionFilter())

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	const swaggerConfig = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Vajro's Woo API")
		.setDescription("Vajro API to consume Woo Commerce API")
		.setVersion("1.0")
		.build()

	const customOptions: SwaggerCustomOptions = {
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
			persistAuthorization: true,
			tagsSorter: (a: any, b: any) => {
				// Sorts the Swagger Groupings Based on this Array
				const desiredOrder = [
					"Admin",
					"Stores",
					"Checkout",
					"Home Page",
					"Dev Tools",
					"Products",
					"Orders"
				]

				const orderForIndexVals = desiredOrder.slice(0).reverse()

				const aIndex = -orderForIndexVals.indexOf(a)

				const bIndex = -orderForIndexVals.indexOf(b)

				return aIndex - bIndex
			}
		},
		customSiteTitle: "Vajro's Woo API"
	}

	const document = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup("swagger", app, document, customOptions)

	await app.listen(process.env.PORT)
}

bootstrap()
