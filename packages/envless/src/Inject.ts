import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import {
    envlessBootstrap,
    envlessFlags,
    ENVLESS_INJECT_UNCONFIGURED,
    ENVLESS_INJECT_USAGE
} from '@/envless/lib/Constants'
import BuildEnvMap from '@/envless/BuildEnvMap'
import DiffEnvMap from '@/envless/DiffEnvMap'
import FetchBundle from '@/envless/FetchBundle'
import IsIsolated from '@/envless/IsIsolated'
import LoadBootstrap from '@/envless/LoadBootstrap'
import MaskValue from '@/envless/MaskValue'
import ParseArgs from '@/envless/ParseArgs'
import ReadEnvFile from '@/envless/ReadEnvFile'
import ReportDiff from '@/envless/ReportDiff'
import ResolveLink from '@/envless/ResolveLink'
import WrapProcess from '@/envless/WrapProcess'
import WriteEnvFile from '@/envless/WriteEnvFile'

const RunEnvlessInject = async () => {
    const { options, command } = ParseArgs()
    const verbose = Boolean(options[envlessFlags.VERBOSE])

    try {
        const cwd = process.cwd()
        const localPath = resolve(cwd, envlessBootstrap.ENV_FILE)
        const local = ReadEnvFile(localPath)
        const write = options[envlessFlags.WRITE]

        if (write && command.length > 0)
            throw new Error(
                'Pass either --write=<file> or -- <command>, not both. The space form --write <file> is not supported.'
            )

        if (options[envlessFlags.DIFF] && command.length > 0)
            throw new Error(
                'Pass either --diff or -- <command>, not both. --diff only reports, it never runs anything.'
            )

        LoadBootstrap(local.parsed)

        const flag = options[envlessFlags.LINK]
        const configured = Boolean(
            (flag && flag !== envlessFlags.TRUE) ||
            process.env[envlessBootstrap.VERSION_LINK]
        )

        if (
            options[envlessFlags.OPTIONAL] &&
            !configured &&
            command.length > 0
        ) {
            console.warn(ENVLESS_INJECT_UNCONFIGURED)
            WrapProcess(command, {}, local.parsed)
            return
        }

        const link = ResolveLink(options)
        const bundle = await FetchBundle(link)
        const map = BuildEnvMap(bundle)
        const names = Object.keys(map).sort()
        const version = bundle.version?.label ?? bundle.version?.id

        console.info(
            `EnvlessInject: decrypted ${names.length} variables${version ? ` from ${version}` : ''}`
        )

        if (verbose)
            for (const name of names)
                console.info(`  ${name} = ${MaskValue(map[name])}`)

        if (options[envlessFlags.DIFF]) {
            ReportDiff(DiffEnvMap(map, local.parsed), localPath)
            return
        }

        if (command.length > 0) {
            if (!IsIsolated() && Object.keys(local.parsed).length > 0)
                console.warn(
                    `EnvlessInject: run this through "bun ${envlessBootstrap.ENV_FILE_FLAG}=/dev/null", otherwise ${envlessBootstrap.ENV_FILE} is loaded into this process and shadows the feed`
                )

            console.info(
                `EnvlessInject: injecting ${names.length} variables into "${command.join(' ')}"`
            )

            WrapProcess(command, map, local.parsed)
            return
        }

        if (!write) throw new Error(ENVLESS_INJECT_USAGE)

        const target =
            write !== envlessFlags.TRUE ? write : envlessBootstrap.ENV_FILE

        if (
            existsSync(resolve(cwd, target)) &&
            options[envlessFlags.FORCE] !== envlessFlags.TRUE
        )
            throw new Error(
                `${target} already exists and would be replaced. Migrate it into Envless first, then pass --force.`
            )

        const path = WriteEnvFile(target, map, local.preserved)

        console.info(
            `EnvlessInject: wrote ${names.length} variables to ${path}`
        )
    } catch (error) {
        if (verbose) console.error('RunEnvlessInject', error)
        else
            console.error(
                `EnvlessInject: ${error instanceof Error ? error.message : String(error)}`
            )

        process.exit(1)
    }
}

RunEnvlessInject()