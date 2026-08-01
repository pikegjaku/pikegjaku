const EscapeDouble = (value: string): string =>
    value
        .replace(/\$(?=[\s\S])/g, '\\$')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')

export default EscapeDouble