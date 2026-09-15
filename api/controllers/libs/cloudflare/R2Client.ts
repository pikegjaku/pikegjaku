import { S3Client } from '@aws-sdk/client-s3'
import { env } from '@goenvless/env/server'

const credentials = {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY
}

const R2Client = new S3Client({
    region: 'auto',
    credentials,
    endpoint: env.CLOUDFLARE_S3_EU_ENDPOINT,
    forcePathStyle: true
})

export default R2Client