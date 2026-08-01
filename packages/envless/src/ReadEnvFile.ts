import type { EnvlessLocalEnv } from '@/envless/ts/Interfaces'
import type { EnvlessEnvMap } from '@/envless/ts/Types'

import { existsSync, readFileSync } from 'node:fs'
import { envlessBootstrap, envlessCrypto } from '@/envless/lib/Constants'
import ExpandEnvValue from '@/envless/ExpandEnvValue'
import ParseEnvValue from '@/envless/ParseEnvValue'

const EXPORT_PREFIX = /^export\s+/
const BYTE_ORDER_MARK = /^\uFEFF/

const FindClose = (value: string, quote: string): number => {
    for (let at = 0; at < value.length; at++) {
        if (quote === '"' && value[at] === '\\') {
            at++
            continue
        }

        if (value[at] === quote) return at
    }

    return -1
}

const ReadEnvFile = (path: string): EnvlessLocalEnv => {
    const staged: EnvlessEnvMap = {}
    const parsed: EnvlessEnvMap = {}
    const preserved: string[] = []

    if (!existsSync(path)) return { parsed, preserved }

    const lines = readFileSync(path, envlessCrypto.ENCODING)
        .replace(BYTE_ORDER_MARK, '')
        .split(/\r?\n/)

    let index = 0

    while (index < lines.length) {
        const start = index
        const line = lines[index].trim().replace(EXPORT_PREFIX, '')
        const equals = line.indexOf('=')

        index++

        if (!line || line.startsWith('#') || equals === -1) continue

        const key = line.slice(0, equals).trim()
        const rest = line.slice(equals + 1).trim()
        const quote =
            rest.startsWith('"') || rest.startsWith("'") ? rest[0] : ''

        const resume = index

        let raw = quote ? rest.slice(1) : rest
        let closed = !quote

        if (quote) {
            while (FindClose(raw, quote) === -1 && index < lines.length) {
                raw = `${raw}\n${lines[index]}`
                index++
            }

            const end = FindClose(raw, quote)

            closed = end !== -1

            if (closed) raw = raw.slice(0, end)
            else {
                raw = rest
                index = resume
            }
        }

        staged[key] = ParseEnvValue(raw, closed ? quote : '')

        if (key.startsWith(envlessBootstrap.PREFIX))
            preserved.push(lines.slice(start, index).join('\n'))
    }

    for (const key of Object.keys(staged))
        parsed[key] = ExpandEnvValue(staged[key], staged)

    return { parsed, preserved }
}

export default ReadEnvFile