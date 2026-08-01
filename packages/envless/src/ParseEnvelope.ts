import type { EnvlessEnvelope } from '@/envless/ts/Interfaces'

import {
    envlessCrypto,
    PARSE_ENVELOPE_UNSUPPORTED_MESSAGE
} from '@/envless/lib/Constants'

const ParseEnvelope = (envelope: string): EnvlessEnvelope => {
    if (envelope.startsWith(envlessCrypto.ENVELOPE_V2)) {
        const rest = envelope.slice(envlessCrypto.ENVELOPE_V2.length)
        const separator = rest.indexOf(':')

        if (separator === -1)
            throw new Error(PARSE_ENVELOPE_UNSUPPORTED_MESSAGE)

        const iterations = Number(rest.slice(0, separator))

        if (!Number.isInteger(iterations))
            throw new Error(PARSE_ENVELOPE_UNSUPPORTED_MESSAGE)
        if (iterations < envlessCrypto.PBKDF2_ITERATIONS_MIN)
            throw new Error(PARSE_ENVELOPE_UNSUPPORTED_MESSAGE)
        if (iterations > envlessCrypto.PBKDF2_ITERATIONS_MAX)
            throw new Error(PARSE_ENVELOPE_UNSUPPORTED_MESSAGE)

        return { payload: rest.slice(separator + 1), iterations }
    }

    if (envelope.startsWith(envlessCrypto.ENVELOPE_V1))
        return {
            payload: envelope.slice(envlessCrypto.ENVELOPE_V1.length),
            iterations: null
        }

    throw new Error(PARSE_ENVELOPE_UNSUPPORTED_MESSAGE)
}

export default ParseEnvelope