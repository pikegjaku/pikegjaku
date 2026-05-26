import { CreateBucketCommand } from '@aws-sdk/client-s3'
import { R2Client } from '@/controllers/libs/cloudflare'
import { Console } from '@/controllers/helpers/logs'

const CreateBucket = async (slug: string): Promise<boolean> => {
    try {
        const data = await R2Client.send(
            new CreateBucketCommand({
                Bucket: slug
            })
        )

        return data?.$metadata?.httpStatusCode === 200
    } catch (error) {
        Console.Error('CreateBucket', error)
        return false
    }
}

export default CreateBucket