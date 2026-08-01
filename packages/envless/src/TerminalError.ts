import type { EnvlessFeedFailure } from '@/envless/ts/Interfaces'

const TerminalError = (message: string): EnvlessFeedFailure => {
    const error: EnvlessFeedFailure = new Error(message)

    error.terminal = true

    return error
}

export default TerminalError