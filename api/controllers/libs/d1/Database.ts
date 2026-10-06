import { env } from 'cloudflare:workers'
import Store from '@/controllers/libs/d1/Store'

const Database = (): D1Database | D1DatabaseSession => Store.getStore() ?? env.DB

export default Database