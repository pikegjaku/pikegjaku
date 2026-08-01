import type { EnvlessEnvMap, EnvlessOptions } from '@/envless/ts/Types'

export interface EnvlessKdf {
    algorithm?: string
    hash?: string
    keyLength?: number
    salt?: string
    iterations?: number
}

export interface EnvlessDecryption {
    kdf?: EnvlessKdf
}

export interface EnvlessVariable {
    name: string
    value?: string | null
    defaultValue?: string | null
    default?: string | null
}

export interface EnvlessVersion {
    id?: string
    label?: string
    variableCount?: number
    createdAt?: string
}

export interface EnvlessBundle {
    format: string
    kdf?: EnvlessKdf
    decryption?: EnvlessDecryption
    version?: EnvlessVersion
    variables: EnvlessVariable[]
}

export interface EnvlessFeedFailure extends Error {
    terminal?: boolean
}

export interface EnvlessFeedPayload extends Partial<EnvlessBundle> {
    data?: EnvlessBundle
    message?: string
}

export interface EnvlessEnvelope {
    payload: string
    iterations: number | null
}

export interface EnvlessArguments {
    options: EnvlessOptions
    command: string[]
}

export interface EnvlessLocalEnv {
    parsed: EnvlessEnvMap
    preserved: string[]
}

export interface EnvlessDiff {
    added: string[]
    changed: string[]
    same: string[]
    missing: string[]
}