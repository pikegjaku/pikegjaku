import { envlessMask } from '@/envless/lib/Constants'

const MaskValue = (value: string): string =>
    value.length === 0
        ? envlessMask.EMPTY
        : envlessMask.CHAR.repeat(envlessMask.LENGTH)

export default MaskValue