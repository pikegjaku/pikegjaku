const NewId = (): string => {
    const time = Math.floor(Date.now() / 1000)
        .toString(16)
        .padStart(8, '0')

    const random = Array.from(crypto.getRandomValues(new Uint8Array(8)), (byte) =>
        byte.toString(16).padStart(2, '0')
    ).join('')

    return `${time}${random}`
}

export default NewId