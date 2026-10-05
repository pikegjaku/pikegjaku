import { spawn } from 'node:child_process'
import { load } from '@goenvless/env/server'
import { Console } from '@/controllers/helpers/logs'
import config from '@/wrangler.json'

const Run = async () => {
    const values = await load()
    const names = config.secrets.required

    const missing = names.filter((name) => !values[name])

    if (missing.length > 0) {
        Console.Error('Deploy', `Mungojnë në Envless: ${missing.join(', ')}`)
        process.exit(1)
    }

    const secrets = Object.fromEntries(names.map((name) => [name, values[name]]))

    const wrangler = spawn(
        'printf "%s" "$WRANGLER_SECRETS" | bunx wrangler deploy --secrets-file /dev/stdin',
        {
            shell: true,
            stdio: 'inherit',
            env: { ...process.env, WRANGLER_SECRETS: JSON.stringify(secrets) }
        }
    )

    const code = await new Promise<number>((resolve) =>
        wrangler.on('close', (exitCode) => resolve(exitCode ?? 1))
    )

    process.exit(code)
}

try {
    await Run()
} catch (error) {
    Console.Error('Deploy', error)
    process.exit(1)
}