import { env } from 'cloudflare:workers'
import { SERVER_LOCATION } from '@/data/constants'

const Gateway = (request: Request): Promise<Response> =>
    env.SERVER.getByName(SERVER_LOCATION, {
        locationHint: SERVER_LOCATION
    }).fetch(request)

export default Gateway