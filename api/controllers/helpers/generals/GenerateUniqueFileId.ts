const GenerateUniqueFileId = (): string => {
    return (
        Math.random().toString(36).substring(2, 8) +
        'x' +
        Math.random().toString(36).substring(2, 8)
    )
}

export default GenerateUniqueFileId