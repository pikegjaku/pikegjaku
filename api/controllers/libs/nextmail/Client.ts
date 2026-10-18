import { Nextmail } from '@nextmail/sdk'
import { env } from 'cloudflare:workers'

let client: Nextmail | null = null

const Client = (): Nextmail => {
    if (!client) client = new Nextmail({ apiKey: env.NEXTMAIL_API_KEY })

    return client
}

export default Client