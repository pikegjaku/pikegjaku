import type { EnvlessKdf } from '@/envless/ts/Interfaces'

import { createDecipheriv } from 'node:crypto'
import { envlessCrypto } from '@/envless/lib/Constants'
import ParseEnvelope from '@/envless/ParseEnvelope'
import ResolveKey from '@/envless/ResolveKey'

const DecryptValue = (
    envelope: string,
    kdf: EnvlessKdf | undefined
): string => {
    const parsed = ParseEnvelope(envelope)
    const iterations =
        parsed.iterations ?? kdf?.iterations ?? envlessCrypto.PBKDF2_ITERATIONS
    const key = ResolveKey(kdf, iterations)
    const payload = Buffer.from(parsed.payload, 'base64')
    const iv = payload.subarray(0, envlessCrypto.IV_LENGTH)
    const tag = payload.subarray(payload.length - envlessCrypto.TAG_BYTES)
    const ciphertext = payload.subarray(
        envlessCrypto.IV_LENGTH,
        payload.length - envlessCrypto.TAG_BYTES
    )
    const decipher = createDecipheriv(envlessCrypto.CIPHER, key, iv)

    decipher.setAuthTag(tag)

    return Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ]).toString(envlessCrypto.ENCODING)
}

export default DecryptValue