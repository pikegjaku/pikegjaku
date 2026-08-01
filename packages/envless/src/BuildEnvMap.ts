import type { EnvlessBundle } from '@/envless/ts/Interfaces'
import type { EnvlessEnvMap } from '@/envless/ts/Types'

import DecryptValue from '@/envless/DecryptValue'
import IsEnvelope from '@/envless/IsEnvelope'

const BuildEnvMap = (bundle: EnvlessBundle): EnvlessEnvMap => {
    const kdf = bundle.decryption?.kdf ?? bundle.kdf
    const map: EnvlessEnvMap = {}
    const empty: string[] = []

    for (const variable of bundle.variables) {
        const envelope = variable.value

        if (!envelope) {
            const fallback = variable.defaultValue ?? variable.default

            if (fallback === undefined || fallback === null) {
                empty.push(variable.name)
                continue
            }

            const raw = String(fallback)

            try {
                map[variable.name] = IsEnvelope(raw)
                    ? DecryptValue(raw, kdf)
                    : raw
            } catch (error) {
                throw new Error(
                    `Failed to decrypt the default value of ${variable.name}: ${error instanceof Error ? error.message : String(error)}`
                )
            }

            continue
        }

        try {
            map[variable.name] = DecryptValue(envelope, kdf)
        } catch (error) {
            throw new Error(
                `Failed to decrypt ${variable.name}: ${error instanceof Error ? error.message : String(error)}`
            )
        }
    }

    if (empty.length > 0)
        console.warn(
            `EnvlessInject: the feed carries no value for ${empty.length} variables, leaving them unset: ${empty.join(', ')}`
        )

    if (bundle.variables.length === 0)
        console.warn(
            'EnvlessInject: this published version has no variables, the local .env is the only source'
        )

    return map
}

export default BuildEnvMap