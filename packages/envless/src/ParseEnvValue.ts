import { parseEnvValueEscapes } from '@/envless/lib/Constants'

const ParseEnvValue = (raw: string, quote: string): string => {
    if (quote === "'") return raw

    if (quote === '"')
        return raw.replace(/\\(.)/g, (match, character: string) =>
            character in parseEnvValueEscapes
                ? parseEnvValueEscapes[character]
                : match
        )

    const comment = raw.indexOf('#')

    return (comment === -1 ? raw : raw.slice(0, comment)).trim()
}

export default ParseEnvValue