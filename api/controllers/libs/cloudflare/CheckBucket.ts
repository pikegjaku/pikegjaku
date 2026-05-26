import { ListBucketsCommand } from '@aws-sdk/client-s3'
import { R2Client } from '@/controllers/libs/cloudflare'
import { Console } from '@/controllers/helpers/logs'

const CheckBucket = async (slug: string): Promise<boolean> => {
    try {
        const data = await R2Client.send(new ListBucketsCommand({}))

        if (data && data.Buckets) {
            const bucket = data.Buckets.find((bucket) => bucket.Name === slug)

            return bucket ? true : false
        }

        return false
    } catch (error) {
        Console.Error('CheckBucket', error)
        return false
    }
}

export default CheckBucket