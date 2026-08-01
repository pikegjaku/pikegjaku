const ENVELOPE_PATTERN = /^v[12]:/

const IsEnvelope = (value: string | null | undefined): boolean =>
    typeof value === 'string' && ENVELOPE_PATTERN.test(value)

export default IsEnvelope