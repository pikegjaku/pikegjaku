import type { UploadToBucketFunctionProps } from '@/ts'

import { env } from 'cloudflare:workers'
import { Console } from '@/controllers/helpers/logs'

const UploadToBucket = async (
    props: UploadToBucketFunctionProps
): Promise<boolean> => {
    try {
        const { path, file, type } = props

        const object = await env.CDN.put(path, file, {
            httpMetadata: { contentType: type }
        })

        return object !== null
    } catch (error) {
        Console.Error('UploadToBucket', error)
        return false
    }
}

export default UploadToBucket