const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '::1']

const IsLocalHost = (host: string): boolean => {
    const hostname = host.replace(/^\[|\]$/g, '').toLowerCase()

    return LOCAL_HOSTNAMES.includes(hostname) || hostname.endsWith('.localhost')
}

const WithProtocol = (value: string): string => {
    if (!value) return value

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value) || value.startsWith('//'))
        return value

    if (/^[./?#]/.test(value)) return value

    const host = value.split('/')[0].replace(/:\d+$/, '')

    if (!host) return value

    const protocol = IsLocalHost(host) ? 'http' : 'https'

    return `${protocol}://${value}`
}

export default WithProtocol