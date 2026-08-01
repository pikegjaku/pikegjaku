import { createHash } from 'node:crypto'
import { envlessBootstrap, envlessCrypto } from '@/envless/lib/Constants'

const ResolveSalt = (salt: string | undefined): Buffer => {
    if (salt) {
        const decoded = Buffer.from(salt, 'base64')

        if (decoded.length === 0)
            throw new Error('The feed carries a salt that is not valid base64')

        return decoded
    }

    const workspaceId = process.env[envlessBootstrap.WORKSPACE_ID]

    if (!workspaceId)
        throw new Error(
            `The feed carries no salt, set ${envlessBootstrap.WORKSPACE_ID} so it can be derived`
        )

    return createHash(envlessCrypto.DIGEST)
        .update(`${envlessCrypto.SALT_PREFIX}${workspaceId}`)
        .digest()
        .subarray(0, envlessCrypto.SALT_BYTES)
}

export default ResolveSalt