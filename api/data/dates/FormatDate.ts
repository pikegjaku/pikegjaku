import { DAY_PERIODS, MONTH_NAMES, WAITLIST_DATE_FORMAT } from '@/data/constants'

const FormatDate = (date: Date): string => {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', WAITLIST_DATE_FORMAT)
            .formatToParts(date)
            .map(({ type, value }) => [type, value])
    )

    return `${parts.day} ${MONTH_NAMES[Number(parts.month) - 1]} ${parts.year} në ${parts.hour}:${parts.minute} ${DAY_PERIODS[parts.dayPeriod]}`
}

export default FormatDate