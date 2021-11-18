import { StoreSettingsModule } from "src/store-settings/store-settings.module"
import { ConfigModule as PageConfigModule } from "src/config/config.module"
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common"
import { NotificationModule } from "src/notification/notification.module"
import { CategoriesModule } from "src/categories/categories.module"
import { DevToolsModule } from "src/dev-tools/dev-tools.module"
import { CustomersModule } from "src/customers/customer.module"
import { HomePageModule } from "src/home-page/home-page.module"
import { WooStoreModule } from "src/woo-store/woo-store.module"
import { WishlistModule } from "src/wishlist/wishlist.module"
import { CheckoutModule } from "src/checkout/checkout.module"
import { ProductsModule } from "src/products/products.module"
import { PaymentModule } from "src/payment/payment.module"
import { CouponsModule } from "src/coupons/coupons.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ReviewModule } from "src/review/review.module"
import { StoresModule } from "src/stores/stores.module"
import { OrdersModule } from "src/orders/orders.module"
import { HelmetMiddleware } from "./helmet.middleware"
import { LoggerMiddleware } from "./logger.middleware"
import { UtilsModule } from "src/utils/utils.module"
import { AppController } from "./app.controller"
import { AuthModule } from "src/auth/auth.module"
import { DataModule } from "src/data/data.module"
import { MongooseModule } from "@nestjs/mongoose"
import { CartModule } from "src/cart/cart.module"
import { PdpModule } from "src/pdp/pdp.module"
import { AppService } from "./app.service"

const ENV = process.env.NODE_ENV

const envPath = ENV ? `environment/.env.${ENV}` : `environment/.env.development`

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: envPath
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get("DB_URI")
			}),
			inject: [ConfigService]
		}),
		PdpModule,
		CartModule,
		AuthModule,
		DataModule,
		UtilsModule,
		ReviewModule,
		OrdersModule,
		StoresModule,
		PaymentModule,
		CouponsModule,
		PaymentModule,
		CheckoutModule,
		HomePageModule,
		WooStoreModule,
		WishlistModule,
		ProductsModule,
		DevToolsModule,
		CustomersModule,
		PageConfigModule,
		CategoriesModule,
		NotificationModule,
		StoreSettingsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(LoggerMiddleware).forRoutes("*")

		consumer.apply(HelmetMiddleware).forRoutes("*")
	}
}
