import type { EnvlessOptions } from '@/envless/ts/Types'

import {
    envlessBootstrap,
    envlessFeed,
    envlessFlags
} from '@/envless/lib/Constants'

const ResolveLink = (options: EnvlessOptions): string => {
    const flag = options[envlessFlags.LINK]
    const link =
        flag && flag !== envlessFlags.TRUE
            ? flag
            : process.env[envlessBootstrap.VERSION_LINK]

    if (!link)
        throw new Error(
            `Set ${envlessBootstrap.VERSION_LINK} to the exposed feed URL, in ${envlessBootstrap.ENV_FILE} locally or as a platform variable in a container, or pass --link`
        )

    let scheme = ''

    try {
        scheme = new URL(link).protocol
    } catch {
        throw new Error(
            `${envlessBootstrap.VERSION_LINK} is not a valid URL: ${link}`
        )
    }

    if (!envlessFeed.SCHEMES.includes(scheme))
        throw new Error(
            `${envlessBootstrap.VERSION_LINK} must be an http or https URL: ${link}`
        )

    return link
}

export default ResolveLink