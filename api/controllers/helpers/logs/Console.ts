const OnInfoConsole = (func: string, message: unknown) => {
    console.info(`[INFO] ${func}:`, message)
}

const OnWarningConsole = (func: string, message: unknown) => {
    console.warn(`[WARNING] ${func}:`, message)
}

const OnErrorConsole = (func: string, message: unknown) => {
    console.error(`[ERROR] ${func}:`, message)
}

const Console = {
    Error: (func: string, message: unknown) => OnErrorConsole(func, message),
    Info: (func: string, message: unknown) => OnInfoConsole(func, message),
    Warning: (func: string, message: unknown) => OnWarningConsole(func, message)
}

export default Console