const envlessBootstrap = {
    VERSION_LINK: 'ENVLESS_VERSION_LINK',
    PASSPHRASE: 'ENVLESS_PASSPHRASE',
    KEY: 'ENVLESS_KEY',
    WORKSPACE_ID: 'ENVLESS_WORKSPACE_ID',
    PREFIX: 'ENVLESS_',
    FORMAT: 'envless.encrypted-export/v1',
    ENV_FILE: '.env',
    ENV_FILE_FLAG: '--env-file',
    ENV_FILE_MODE: 0o600,
    BIN_DIR: 'node_modules/.bin'
} as const

const envlessCrypto = {
    CIPHER: 'aes-256-gcm',
    DIGEST: 'sha256',
    ENCODING: 'utf8',
    KEY_BYTES: 32,
    TAG_BYTES: 16,
    IV_LENGTH: 12,
    SALT_BYTES: 16,
    SALT_PREFIX: 'envless:workspace:',
    ENVELOPE_V1: 'v1:',
    ENVELOPE_V2: 'v2:',
    PBKDF2_ITERATIONS: 200000,
    PBKDF2_ITERATIONS_MIN: 100000,
    PBKDF2_ITERATIONS_MAX: 1000000
} as const

const envlessFeed = {
    TIMEOUT_MS: 8000,
    BACKOFF_MS: [500, 1500, 3500],
    SERVER_ERROR: 500,
    RETRYABLE_STATUSES: [408, 425, 429] as readonly number[],
    SCHEMES: ['http:', 'https:'] as readonly string[]
} as const

const envlessMask = {
    EMPTY: '(empty)',
    CHAR: '*',
    LENGTH: 8
} as const

const envlessFlags = {
    LINK: 'link',
    WRITE: 'write',
    FORCE: 'force',
    DIFF: 'diff',
    VERBOSE: 'verbose',
    OPTIONAL: 'optional',
    TRUE: 'true'
} as const

const envlessValueFlags = [envlessFlags.LINK] as const

const ENVLESS_INJECT_USAGE =
    'Nothing to do. Pass -- <command> to run something with the feed injected, --diff to compare the feed against the local .env, or --write=<file> to render one.' as const

const PARSE_ENVELOPE_UNSUPPORTED_MESSAGE =
    'Unsupported variable format' as const

const parseEnvValueEscapes: Record<string, string> = {
    n: '\n',
    r: '\r'
}

const RESOLVE_KEY_SEPARATOR = '\0' as const

const ENVLESS_INJECT_UNCONFIGURED =
    'EnvlessInject: no feed configured, running the command with the ambient environment' as const

export {
    envlessBootstrap,
    envlessCrypto,
    envlessFeed,
    envlessMask,
    envlessValueFlags,
    envlessFlags,
    ENVLESS_INJECT_USAGE,
    ENVLESS_INJECT_UNCONFIGURED,
    PARSE_ENVELOPE_UNSUPPORTED_MESSAGE,
    parseEnvValueEscapes,
    RESOLVE_KEY_SEPARATOR
}