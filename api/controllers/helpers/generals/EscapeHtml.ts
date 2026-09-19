const ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}

const EscapeHtml = (value: string): string =>
    String(value).replace(/[&<>"']/g, (char) => ESCAPES[char] || char)

export default EscapeHtml