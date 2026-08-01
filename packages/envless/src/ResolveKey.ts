import type { EnvlessKdf } from '@/envless/ts/Interfaces'

import { createHash, pbkdf2Sync } from 'node:crypto'
import {
    envlessBootstrap,
    envlessCrypto,
    RESOLVE_KEY_SEPARATOR
} from '@/envless/lib/Constants'
import ResolveSalt from '@/envless/ResolveSalt'

const KEY_CACHE: Record<string, Buffer> = {}

const ResolveKey = (
    kdf: EnvlessKdf | undefined,
    iterations: number
): Buffer => {
    const raw = process.env[envlessBootstrap.KEY]

    if (raw) {
        const key = Buffer.from(raw, 'base64url')

        if (key.length !== envlessCrypto.KEY_BYTES)
            throw new Error(
                `${envlessBootstrap.KEY} must decode to a ${envlessCrypto.KEY_BYTES}-byte key`
            )

        return key
    }

    const passphrase = process.env[envlessBootstrap.PASSPHRASE]

    if (!passphrase)
        throw new Error(
            `Set ${envlessBootstrap.KEY} or ${envlessBootstrap.PASSPHRASE} to decrypt the feed`
        )

    if (
        !Number.isInteger(iterations) ||
        iterations < envlessCrypto.PBKDF2_ITERATIONS_MIN ||
        iterations > envlessCrypto.PBKDF2_ITERATIONS_MAX
    )
        throw new Error('Unsupported variable format')

    const salt = ResolveSalt(kdf?.salt)
    const cacheKey = createHash(envlessCrypto.DIGEST)
        .update(
            [passphrase, salt.toString('base64'), String(iterations)].join(
                RESOLVE_KEY_SEPARATOR
            )
        )
        .digest('hex')

    if (!KEY_CACHE[cacheKey])
        KEY_CACHE[cacheKey] = pbkdf2Sync(
            passphrase,
            salt,
            iterations,
            envlessCrypto.KEY_BYTES,
            envlessCrypto.DIGEST
        )

    return KEY_CACHE[cacheKey]
}

export default ResolveKey