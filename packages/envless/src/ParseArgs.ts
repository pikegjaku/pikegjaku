import type { EnvlessArguments } from '@/envless/ts/Interfaces'
import type { EnvlessOptions } from '@/envless/ts/Types'

import { envlessFlags, envlessValueFlags } from '@/envless/lib/Constants'

const ParseArgs = (): EnvlessArguments => {
    const argv = process.argv.slice(2)
    const options: EnvlessOptions = {}

    let command: string[] = []
    let index = 0

    while (index < argv.length) {
        const token = argv[index]

        if (token === '--') {
            command = argv.slice(index + 1)
            break
        }

        if (!token.startsWith('--')) {
            command = argv.slice(index)
            break
        }

        const name = token.slice(2)
        const inline = name.indexOf('=')

        if (inline !== -1) {
            options[name.slice(0, inline)] = name.slice(inline + 1)
            index++
            continue
        }

        if (envlessValueFlags.some((flag) => flag === name)) {
            const next = argv[index + 1]

            if (next !== undefined && !next.startsWith('--')) {
                options[name] = next
                index += 2
                continue
            }
        }

        options[name] = envlessFlags.TRUE
        index++
    }

    return { options, command }
}

export default ParseArgs