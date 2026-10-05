import { Gateway, Server } from '@/controllers/libs/workers'

export { Server }

export default {
    fetch: Gateway
} satisfies ExportedHandler<Env>