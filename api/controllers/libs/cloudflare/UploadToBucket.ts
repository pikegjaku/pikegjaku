import type { UploadToBucketFunctionProps } from '@/ts'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import {
    CheckBucket,
    CreateBucket,
    R2Client
} from '@/controllers/libs/cloudflare'
import { Console } from '@/controllers/helpers/logs'

const UploadToBucket = async (
    props: UploadToBucketFunctionProps
): Promise<boolean> => {
    try {
        const { bucket, path, file, type, publicObject } = props

        const exists = await CheckBucket(bucket)

        if (exists) {
            const command = {
                Bucket: bucket,
                Key: path,
                Body: file,
                ContentType: type
            }

            if (publicObject) {
                // @ts-expect-error ACL is not defined in PutObjectCommand
                command.ACL = 'public-read'
            }

            const data = await R2Client.send(new PutObjectCommand(command))

            return data?.$metadata?.httpStatusCode === 200
        } else {
            const is_created = await CreateBucket(bucket)

            if (is_created) {
                const data = await R2Client.send(
                    new PutObjectCommand({
                        Bucket: bucket,
                        Key: path,
                        Body: file,
                        ContentType: 'application/json'
                    })
                )

                return data?.$metadata?.httpStatusCode === 200
            } else return false
        }
    } catch (error) {
        Console.Error('UploadToBucket', error)
        return false
    }
}

export default UploadToBucket