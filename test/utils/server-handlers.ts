import * as customersData from "test/data/customer/customers.json"
import * as mockProducts from "test/data/mock-products.json"
import * as productData from "test/data/pdp/product.json"
import * as productvariations from "test/data/checkout/product.json"
import * as productVariantData from "test/data/pdp/product-variation.json"
import * as currencyData from "test/data/common/currency.json"
import * as mockCustomer from "test/data/customer/woo-customer-data.json"
import * as mockcustupdate from "test/data/customer/woo-customer-update-data.json"
import * as mockcustgetbyid from "test/data/customer/woo-customer-getById.json"
import * as mockcustAdd from "test/data/customer/woo-customer-create-data.json"
import * as tax from "test/data/checkout/tax.json"

import { rest } from "msw"

const API_URL = "https://*/wp-json/wc/v3"

const AUTH_URL = "https://*/"

const handlers = [
	rest.get(`${API_URL}/products/*/variations`, (req, res, ctx) =>
		res(ctx.json(productVariantData))
	),
	rest.get(`${API_URL}/products/*`, (req, res, ctx) => res(ctx.json(productData))),
	rest.get(`${API_URL}/products/*/variations/*`, (req, res, ctx) =>
		res(ctx.json(productvariations))
	),
	rest.get(`${API_URL}/products`, (req, res, ctx) => res(ctx.json(mockProducts))),
	rest.get(`${API_URL}/customers`, (req, res, ctx) => res(ctx.json(customersData))),
	rest.get(`${API_URL}/data/currencies/current`, (req, res, ctx) => res(ctx.json(currencyData))),
	rest.get(`${API_URL}/customers`, (req, res, ctx) => res(ctx.json(mockCustomer))),
	rest.put(`${API_URL}/customers/*`, (req, res, ctx) => res(ctx.json(mockcustupdate))),
	rest.get(`${API_URL}/customers/*`, (req, res, ctx) => res(ctx.json(mockcustgetbyid))),
	rest.post(`${API_URL}/customers`, (req, res, ctx) => res(ctx.json(mockcustAdd))),
	rest.get(`${API_URL}/taxes`, (req, res, ctx) => res(ctx.json(tax))),
	rest.post(`${AUTH_URL}`, (req, res, ctx) => res(ctx.json({})))
]

export { handlers }
