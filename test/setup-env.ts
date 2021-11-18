import { server } from "./utils/server"

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
