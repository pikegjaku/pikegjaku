import { resolve } from 'node:path'
import { envlessBootstrap } from '@/envless/lib/Constants'

const ReadEnvFileFlags = (): string[] => {
    const files: string[] = []
    const argv = process.execArgv

    for (let index = 0; index < argv.length; index++) {
        const argument = argv[index]

        if (argument.startsWith(`${envlessBootstrap.ENV_FILE_FLAG}=`)) {
            files.push(
                argument.slice(envlessBootstrap.ENV_FILE_FLAG.length + 1)
            )
            continue
        }

        if (argument === envlessBootstrap.ENV_FILE_FLAG && argv[index + 1]) {
            files.push(argv[index + 1])
            index++
        }
    }

    return files
}

const IsIsolated = (): boolean => {
    const files = ReadEnvFileFlags()

    if (files.length === 0) return false

    const local = resolve(process.cwd(), envlessBootstrap.ENV_FILE)

    return !files.some((file) => resolve(process.cwd(), file) === local)
}

export default IsIsolated