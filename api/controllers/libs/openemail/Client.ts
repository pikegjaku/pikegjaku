import { OpenEmail } from '@openemail/sdk'
import { env } from '@goenvless/env/server'

let client: OpenEmail | null = null

const Client = (): OpenEmail => {
    if (!client) client = new OpenEmail({ apiKey: env.OPENEMAIL_API_KEY })

    return client
}

export default Client