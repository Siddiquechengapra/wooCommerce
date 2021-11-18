import { handlers } from "./server-handlers"
import { setupServer } from "msw/node"
import { rest } from "msw"

const server = setupServer(...handlers)

export { server, rest }
