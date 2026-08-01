import EscapeDouble from '@/envless/EscapeDouble'

const BARE_UNSAFE = /^\s|\s$|[#$'"\n\r]/
const DOUBLE_UNSAFE = /["\\]/
const SINGLE_UNSAFE = /['$\n\r]/

const EncodeValue = (name: string, value: string): string => {
    if (value === '' || !BARE_UNSAFE.test(value)) return value

    if (!SINGLE_UNSAFE.test(value)) return `'${value}'`

    if (!DOUBLE_UNSAFE.test(value)) return `"${EscapeDouble(value)}"`

    throw new Error(
        `${name} mixes backslashes or double quotes with characters a dotenv file cannot escape. Run the command through the feed instead of writing a file.`
    )
}

export default EncodeValue