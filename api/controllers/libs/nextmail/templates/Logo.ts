import { BRAND, LOGO_PIXELS } from '@/data/constants'

const Logo = (): string => {
    const rows = []

    for (let row = 0; row <= 8; row++) {
        const cells = []

        for (let col = 0; col <= 6; col++) {
            const filled = LOGO_PIXELS.some(
                ([x, y]) => x === col && y === row
            )

            cells.push(
                `<td width="6" height="6" style="width:6px;height:6px;line-height:6px;font-size:0;background-color:${filled ? BRAND.RED : 'transparent'};">&nbsp;</td>`
            )
        }

        rows.push(`<tr>${cells.join('')}</tr>`)
    }

    return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:42px;">${rows.join('')}</table>`
}

export default Logo