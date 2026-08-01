import type { EnvlessEnvMap } from '@/envless/ts/Types'

const REFERENCE = /(\\?)\$(\{[A-Za-z0-9_]*\}|[A-Za-z0-9_]*)/g

const Own = (
    source: EnvlessEnvMap | NodeJS.ProcessEnv,
    name: string
): string | undefined =>
    Object.prototype.hasOwnProperty.call(source, name)
        ? source[name]
        : undefined

const ExpandEnvValue = (value: string, scope: EnvlessEnvMap): string =>
    value.replace(
        REFERENCE,
        (match: string, escape: string, body: string, offset: number) => {
            const trailing =
                body === '' && offset + match.length === value.length

            if (escape) return trailing ? match : `$${body}`

            if (trailing) return '$'

            const name = body.startsWith('{') ? body.slice(1, -1) : body

            return Own(process.env, name) ?? Own(scope, name) ?? ''
        }
    )

export default ExpandEnvValue