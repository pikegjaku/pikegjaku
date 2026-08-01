import { fileURLToPath } from 'node:url'

const ResolveRoot = (): string =>
    fileURLToPath(new URL('../../..', import.meta.url))

export default ResolveRoot