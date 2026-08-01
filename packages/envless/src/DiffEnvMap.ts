import type { EnvlessDiff } from '@/envless/ts/Interfaces'
import type { EnvlessEnvMap } from '@/envless/ts/Types'

import { envlessBootstrap } from '@/envless/lib/Constants'

const DiffEnvMap = (map: EnvlessEnvMap, local: EnvlessEnvMap): EnvlessDiff => {
    const added: string[] = []
    const changed: string[] = []
    const same: string[] = []
    const missing: string[] = []

    for (const name of Object.keys(map).sort()) {
        const current = local[name]

        if (current === undefined) {
            added.push(name)
            continue
        }

        if (current === map[name]) same.push(name)
        else changed.push(name)
    }

    for (const name of Object.keys(local).sort()) {
        if (name.startsWith(envlessBootstrap.PREFIX)) continue

        if (map[name] === undefined) missing.push(name)
    }

    return { added, changed, same, missing }
}

export default DiffEnvMap