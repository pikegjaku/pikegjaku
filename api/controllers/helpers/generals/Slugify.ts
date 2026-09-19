const REPLACEMENTS: Record<string, string> = {
    ë: 'e',
    Ë: 'e',
    ç: 'c',
    Ç: 'c'
}

const Slugify = (value: string): string =>
    String(value)
        .replace(/[ëËçÇ]/g, (char) => REPLACEMENTS[char] || char)
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export default Slugify