import type {
    EnvlessBundle,
    EnvlessFeedFailure,
    EnvlessFeedPayload
} from '@/envless/ts/Interfaces'

import { envlessBootstrap, envlessFeed } from '@/envless/lib/Constants'
import TerminalError from '@/envless/TerminalError'

const Delay = (milliseconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, milliseconds))

const IsRetryable = (status: number): boolean =>
    status >= envlessFeed.SERVER_ERROR ||
    envlessFeed.RETRYABLE_STATUSES.includes(status)

const ReadReason = async (response: Response): Promise<string> => {
    try {
        const payload = (await response.json()) as EnvlessFeedPayload | null

        return payload?.message ? `, ${payload.message}` : ''
    } catch {
        return ''
    }
}

const ReadBundle = async (response: Response): Promise<EnvlessBundle> => {
    const body = await response.text()

    let payload: EnvlessFeedPayload | null

    try {
        payload = JSON.parse(body) as EnvlessFeedPayload | null
    } catch {
        throw TerminalError(
            'The feed did not return JSON. Check that the link points at an exposed environment version.'
        )
    }

    const bundle = (
        payload && payload.data ? payload.data : payload
    ) as EnvlessBundle | null

    if (!bundle || bundle.format !== envlessBootstrap.FORMAT)
        throw TerminalError(
            `Unexpected Envless export format, expected ${envlessBootstrap.FORMAT}. A versions list URL returns metadata only, point the link at /versions/latest.`
        )

    if (!Array.isArray(bundle.variables))
        throw TerminalError('The Envless export carried no variables array')

    return bundle
}

const FetchBundle = async (link: string): Promise<EnvlessBundle> => {
    const attempts = envlessFeed.BACKOFF_MS.length + 1

    let failure: EnvlessFeedFailure = new Error(
        'The Envless feed was never reached'
    )

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const response = await fetch(link, {
                signal: AbortSignal.timeout(envlessFeed.TIMEOUT_MS)
            })

            if (!response.ok) {
                const retryable = IsRetryable(response.status)
                const message = `The Envless feed responded ${response.status}${retryable ? '' : await ReadReason(response)}`

                throw retryable ? new Error(message) : TerminalError(message)
            }

            return await ReadBundle(response)
        } catch (error) {
            failure = error instanceof Error ? error : new Error(String(error))

            if (failure.terminal) break

            const backoff = envlessFeed.BACKOFF_MS[attempt - 1]

            if (backoff === undefined) break

            console.warn(
                `EnvlessInject: feed attempt ${attempt}/${attempts} failed (${failure.message}), retrying in ${backoff}ms`
            )

            await Delay(backoff)
        }
    }

    throw failure
}

export default FetchBundle