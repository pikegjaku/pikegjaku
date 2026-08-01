import type { EnvlessEnvMap } from '@/envless/ts/Types'

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { constants } from 'node:os'
import { resolve } from 'node:path'
import { envlessBootstrap } from '@/envless/lib/Constants'
import IsIsolated from '@/envless/IsIsolated'
import ResolveRoot from '@/envless/ResolveRoot'

const ResolveExecutable = (name: string): string => {
    const candidates = [
        resolve(process.cwd(), envlessBootstrap.BIN_DIR, name),
        resolve(ResolveRoot(), envlessBootstrap.BIN_DIR, name)
    ]

    return candidates.find((candidate) => existsSync(candidate)) ?? name
}

const BuildChildEnv = (
    map: EnvlessEnvMap,
    local: EnvlessEnvMap
): NodeJS.ProcessEnv => {
    const childEnv: NodeJS.ProcessEnv = { ...process.env }
    const isolated = IsIsolated()

    for (const name of Object.keys(childEnv))
        if (name.startsWith(envlessBootstrap.PREFIX)) delete childEnv[name]

    for (const name of Object.keys(map)) {
        const current = process.env[name]
        const exported =
            current !== undefined && (isolated || current !== local[name])

        if (exported) continue

        childEnv[name] = map[name]
    }

    return childEnv
}

const WrapProcess = (
    command: string[],
    map: EnvlessEnvMap,
    local: EnvlessEnvMap
): void => {
    const child = spawn(ResolveExecutable(command[0]), command.slice(1), {
        stdio: 'inherit',
        env: BuildChildEnv(map, local),
        shell: false
    })

    let forwarded = 0

    const forward = (signal: NodeJS.Signals) => {
        forwarded++

        child.kill(forwarded > 1 ? 'SIGKILL' : signal)
    }

    process.on('SIGINT', forward)
    process.on('SIGTERM', forward)
    process.on('SIGHUP', forward)

    child.on('exit', (code, signal) => {
        if (signal) {
            process.removeListener('SIGINT', forward)
            process.removeListener('SIGTERM', forward)
            process.removeListener('SIGHUP', forward)

            process.kill(process.pid, signal)
            process.exit(128 + (constants.signals[signal] ?? 0))
        }

        process.exit(code ?? 0)
    })

    child.on('error', (error) => {
        console.error('WrapProcess', error)
        process.exit(1)
    })
}

export default WrapProcess