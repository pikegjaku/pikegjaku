import moment from 'moment'

const CalculateTime = (startTimestamp: Date, endTimestamp: Date) => {
    const start = moment(startTimestamp)
    const end = moment(endTimestamp)

    const duration = moment.duration(end.diff(start))
    const seconds = duration.asSeconds()
    const minutes = duration.asMinutes()
    const hours = duration.asHours()
    const days = duration.asDays()

    return {
        seconds,
        minutes,
        hours,
        days
    }
}

export default CalculateTime