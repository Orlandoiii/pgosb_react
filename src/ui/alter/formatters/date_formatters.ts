export function formatDate(
    value: string,
    minDate: string,
    maxDate: string,
    event?: React.ChangeEvent<HTMLInputElement>
): string {
    return keepCursorPosition(
        () => formatDateTimeInternal(value, false, minDate, maxDate),
        event
    )
}

export function formatDateTime(
    value: string,
    minDateTime: string,
    maxDateTime: string,
    event?: React.ChangeEvent<HTMLInputElement>
): string {
    return keepCursorPosition(
        () => formatDateTimeInternal(value, true, minDateTime, maxDateTime),
        event
    )
}

type FitIntInRangeResult = {
    minReached: boolean
    maxReached: boolean
    value: number
}

const dateSegmentsLength = [2, 2, 4]
const segmentedAbsoluteMinDate = [1, 1, 1]
const segmentedAbsoluteMaxDate = [31, 12, 2100]

const timeSegmentsLength = [2, 2, 2]
const segmentedAbsoluteMinTime = [0, 0, 0]
const segmentedAbsoluteMaxTime = [23, 59, 59]

function keepCursorPosition(
    innerFunction: () => string,
    e?: React.ChangeEvent<HTMLInputElement>
) {
    const cursorStart = e?.currentTarget.selectionStart ?? 0
    const initLength = e?.currentTarget.value.length ?? 0

    const formatted = innerFunction()

    if (e) {
        const finalLength = e.currentTarget.value.length
        e.currentTarget.selectionStart = Math.max(
            cursorStart + finalLength - initLength,
            cursorStart
        )
        e.currentTarget.selectionEnd = Math.max(
            cursorStart + finalLength - initLength,
            cursorStart
        )
    }
    return formatted
}

function formatDateTimeInternal(
    current: string,
    dateTime: boolean,
    minValue: string,
    maxValue: string
) {
    let cleanValue = current.replace(/[^\d\/:\s]/g, '').replace(/\s+/g, ' ')
    let spaces = (cleanValue.match(/\s/g) || []).length

    cleanValue = spaces > 1 ? cleanValue.replace(' ', '') : cleanValue
    spaces = spaces > 1 ? 0 : spaces

    const hasDateTimeFormat = /.*\/.*\/.*(.).*:.*:.*/g.test(cleanValue)
    const hasDateFormat = /.*\/.*\/.*/g.test(cleanValue)

    let date =
        !dateTime || !hasDateFormat
            ? cleanValue
            : hasDateTimeFormat && spaces == 1
              ? cleanValue.split(' ')[0]
              : cleanValue
    let time =
        dateTime && hasDateFormat
            ? hasDateTimeFormat && spaces == 1
                ? cleanValue.split(' ')[1]
                : ''
            : ''

    const [segmentedMinDate, segmentedMaxDate] = [
        minValue.split('/').map((segment) => parseInt(segment)),
        maxValue.split('/').map((segment) => parseInt(segment)),
    ]

    date = formatValue(
        date,
        '/',
        dateSegmentsLength,
        segmentedAbsoluteMaxDate,
        (segmented) => {
            return formatSegmentedDate(
                segmented,
                segmentedMinDate,
                segmentedMaxDate
            )
        }
    )
    if (dateTime)
        time = formatValue(
            time,
            ':',
            timeSegmentsLength,
            segmentedAbsoluteMaxTime,
            formatSegmentedTime
        )

    const result = dateTime && time ? `${date} ${time}` : date
    return result
}

function formatValue(
    value: string,
    separator: string,
    segmentsLength: number[],
    segmentsAbsoluteMax: number[],
    formatter: (segments: number[]) => string
): string {
    let cleanValue = value.replace(`[^\d${separator}]`, '')
    value = cleanValue.replace(/\D/g, '')
    let segmentedValue: number[] = []
    let remainder = ''

    const validatableTime = validatable(
        cleanValue.split(separator),
        segmentsLength
    )
    const hasCompleteTimeFormat =
        separator == '/'
            ? /^\d*\/\d*\/\d*$/.test(cleanValue)
            : /^\d*:\d*:\d*$/.test(cleanValue)

    if (value) {
        if (hasCompleteTimeFormat && !validatableTime) {
            const results: FitIntInRangeResult[] = []
            for (let i = cleanValue.split(separator).length - 1; i >= 0; i--) {
                results.unshift(
                    fitIntInRangeInternal(
                        parseInt(cleanValue.split(separator)[i]),
                        0,
                        segmentsAbsoluteMax[i]
                    )
                )
            }
            value = results
                .map((result) => result.value.toString().padStart(2, '0'))
                .join('/')
                .replace('00', '')
        } else {
            if (hasCompleteTimeFormat)
                segmentedValue = cleanValue
                    .split(separator)
                    .map((x) => parseInt(x))
            else
                [segmentedValue, remainder] = segmentPart(value, segmentsLength)

            value = formatter(segmentedValue)

            if (value && remainder) value = `${value}${separator}${remainder}`
            else if (remainder) value = remainder
        }
    }
    return value
}

function validatable(value: string[], format: number[]): boolean {
    for (let i = 0; i < 3; i++) {
        if (!value[i] || value[i].length < format[i]) return false
    }
    return true
}

function segmentPart(
    cleanValue: string,
    segmentsLength: number[]
): [segments: number[], remainder: string] {
    const segmented: number[] = []
    let remainder = ''

    if (cleanValue.length >= segmentsLength[0]) {
        segmented.push(parseInt(cleanValue.slice(0, segmentsLength[0])))

        if (cleanValue.length >= segmentsLength[0] + segmentsLength[1])
            segmented.push(
                parseInt(
                    cleanValue.slice(
                        segmentsLength[0],
                        segmentsLength[0] + segmentsLength[1]
                    )
                )
            )
        else if (
            cleanValue.length ===
            segmentsLength[0] + segmentsLength[1] - 1
        )
            remainder = cleanValue.slice(
                segmentsLength[0],
                segmentsLength[0] + segmentsLength[1] - 1
            )

        if (
            cleanValue.length ===
            segmentsLength[0] + segmentsLength[1] + segmentsLength[2]
        )
            segmented.push(
                parseInt(
                    cleanValue.slice(
                        segmentsLength[0] + segmentsLength[1],
                        segmentsLength[0] +
                            segmentsLength[1] +
                            segmentsLength[2]
                    )
                )
            )
        else if (
            cleanValue.length >= segmentsLength[0] + segmentsLength[1] &&
            cleanValue.length <
                segmentsLength[0] + segmentsLength[1] + segmentsLength[2]
        )
            remainder = cleanValue.slice(segmentsLength[0] + segmentsLength[1])
        else remainder = cleanValue.slice(segmentsLength[0])
    } else remainder = cleanValue

    return [segmented, remainder]
}

function formatSegmentedDate(
    segmentedDate: number[],
    segmentedMinDate: number[],
    segmentedMaxDate: number[]
): string {
    const results: FitIntInRangeResult[] = []

    for (let i = segmentedDate.length - 1; i >= 0; i--) {
        const [min, max] = getMinMaxDateRange(
            i,
            results,
            segmentedMinDate[i],
            segmentedMaxDate[i]
        )
        results.unshift(fitIntInRangeInternal(segmentedDate[i], min, max))
    }
    return results
        .map((result) => result.value.toString().padStart(2, '0'))
        .join('/')
}

function getMinMaxDateRange(
    position: number,
    previousResult: FitIntInRangeResult[],
    minValue: number,
    maxValue: number
): [min: number, max: number] {
    let [min, max] = [minValue, maxValue]

    if (position === 2) return [min, max]

    if (
        previousResult.length === 0 ||
        !previousResult.every((item) => item.minReached)
    )
        min = segmentedAbsoluteMinDate[position]
    else if (position === 0) {
        min =
            previousResult.every((item) => item.minReached) &&
            previousResult.length > 1
                ? minValue
                : segmentedAbsoluteMinDate[position]
    }

    if (previousResult.length === 0) max = segmentedAbsoluteMaxDate[position]
    else if (position === 1 && !previousResult.every((item) => item.maxReached))
        max = segmentedAbsoluteMaxDate[position]
    else if (!previousResult.every((item) => item.maxReached)) {
        const year =
            previousResult.length === 2 ? previousResult[1].value : 2024
        const month = previousResult.length >= 1 ? previousResult[0].value : 12

        max = daysInMonth(month, year)
    } else if (position === 0) {
        max =
            previousResult.every((item) => item.maxReached) &&
            previousResult.length > 1
                ? maxValue
                : segmentedAbsoluteMaxDate[position]
    }

    return [min, max]
}

function fitIntInRangeInternal(
    value: number,
    minValue: number,
    maxValue: number
): FitIntInRangeResult {
    if (isNaN(value)) value = 0
    value = Math.max(minValue, Math.min(value, maxValue))
    return {
        minReached: value === minValue,
        maxReached: value === maxValue,
        value,
    }
}

function daysInMonth(month: number, year: number): number {
    if (month < 1 || month > 12) throw new Error('Invalid month value')
    return new Date(year, month, 0).getDate()
}

function formatSegmentedTime(segmentedTime: number[]) {
    const results: FitIntInRangeResult[] = []

    for (let i = segmentedTime.length - 1; i >= 0; i--) {
        results.unshift(
            fitIntInRangeInternal(
                segmentedTime[i],
                segmentedAbsoluteMinTime[i],
                segmentedAbsoluteMaxTime[i]
            )
        )
    }
    return results
        .map((result) => result.value.toString().padStart(2, '0'))
        .join(':')
}
