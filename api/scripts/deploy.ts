import { spawn } from 'node:child_process'
import { load } from '@goenvless/env/server'
import { Console } from '@/controllers/helpers/logs'
import config from '@/wrangler.json'

const Execute = (
    command: string,
    env: NodeJS.ProcessEnv = process.env
): Promise<number> =>
    new Promise((resolve) =>
        spawn(command, { shell: true, stdio: 'inherit', env }).on(
            'close',
            (code) => resolve(code ?? 1)
        )
    )

const Run = async () => {
    const values = await load()
    const names = config.secrets.required

    const missing = names.filter((name) => !values[name])

    if (missing.length > 0) {
        Console.Error('Deploy', `Mungojnë në Envless: ${missing.join(', ')}`)
        process.exit(1)
    }

    const secrets = Object.fromEntries(names.map((name) => [name, values[name]]))

    const migrated = await Execute('bunx wrangler d1 migrations apply DB --remote')

    if (migrated !== 0) process.exit(migrated)

    const deployed = await Execute(
        'printf "%s" "$WRANGLER_SECRETS" | bunx wrangler deploy --secrets-file /dev/stdin',
        { ...process.env, WRANGLER_SECRETS: JSON.stringify(secrets) }
    )

    process.exit(deployed)
}

try {
    await Run()
} catch (error) {
    Console.Error('Deploy', error)
    process.exit(1)
}