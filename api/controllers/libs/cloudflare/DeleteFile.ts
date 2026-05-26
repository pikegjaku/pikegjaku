import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { R2Client } from '@/controllers/libs/cloudflare'
import { Console } from '@/controllers/helpers/logs'

const DeleteFile = async (path: string, bucket: string): Promise<boolean> => {
    try {
        const deleteData = await R2Client.send(
            new DeleteObjectCommand({
                Bucket: bucket,
                Key: path
            })
        )

        return (
            deleteData?.$metadata?.httpStatusCode === 200 ||
            deleteData?.$metadata?.httpStatusCode === 204
        )
    } catch (error) {
        Console.Error('DeleteFile', error)
        return false
    }
}

export default DeleteFile