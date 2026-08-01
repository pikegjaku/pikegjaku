import type { EnvlessEnvMap } from '@/envless/ts/Types'

import { envlessBootstrap } from '@/envless/lib/Constants'

const LoadBootstrap = (parsed: EnvlessEnvMap): void => {
    for (const key of Object.keys(parsed)) {
        if (!key.startsWith(envlessBootstrap.PREFIX)) continue

        if (process.env[key]) continue

        process.env[key] = parsed[key]
    }
}

export default LoadBootstrap