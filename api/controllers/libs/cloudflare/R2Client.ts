import { S3Client } from '@aws-sdk/client-s3'

import { CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_S3_EU_ENDPOINT, CLOUDFLARE_SECRET_ACCESS_KEY } from '@/data/constants'

const credentials = {
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY
}

const R2Client = new S3Client({
    region: 'auto',
    credentials,
    endpoint: CLOUDFLARE_S3_EU_ENDPOINT,
    forcePathStyle: true
})

export default R2Client