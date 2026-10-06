const EscapeLike = (value: unknown): string =>
    String(value).replace(/[\\%_]/g, (char) => `\\${char}`)

export default EscapeLike