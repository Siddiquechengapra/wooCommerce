import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { createMock } from "@golevelup/ts-jest"
import { Request } from "express"

export const mockRequestObject = () => {
	return createMock<Request>({
		user: {
			store_id: "a2b",
			WooCommerce: new WooCommerceRestApi({
				url: "https://example.com",
				consumerKey: "consumer_key",
				consumerSecret: "consumer_secret",
				queryStringAuth: true
			})
		}
	})
}

export const JwtGuardProvider = {
	provide: JwtAuthGuard,
	useValue: jest.fn().mockImplementation(() => true)
}
