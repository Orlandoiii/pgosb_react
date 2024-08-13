export function formatAsDecimal(value: string, initValue: string): string {
    if (!value.trim()) return '0,00'

    const segmented = initValue.split(',')
    const decimals =
        segmented.length > 1
            ? segmented[1].length > 2
                ? 2
                : segmented[1].length
            : 0
    value += '0'.repeat(2 - decimals)

    return value.includes('-')
        ? `-${formatAmount(value.replace('-', ''), 2)}`
        : formatAmount(value, 2)
}

export function formatAsInt(value: string): string {
    if (!value.trim()) return '0'
    return formatAmount(value, 0)
}

export function formatAmount(amount: string, decimals: number): string {
    amount = addOrRemoveLeadingZeros(amount, decimals)

    const regex = new RegExp(`^(\\d+)(\\d{${decimals}})$`)
    const match = amount.match(regex)
    amount = ''

    if (match) {
        const wholeNumber = match[1]
        const decimalPlaces = match[2]
        let count = 0

        for (const digit of wholeNumber) {
            if (amount === '') {
                count = 3 - (wholeNumber.length % 3)
                count = count === 3 ? 0 : count
            }

            if (count === 3) {
                amount += '.'
                count = 0
            }

            amount += digit
            count++
        }

        if (decimals > 0) amount += ',' + decimalPlaces
    }

    return amount
}

function addOrRemoveLeadingZeros(amount: string, decimals: number): string {
    let tempAmount = ''

    for (const digit of amount) {
        if (tempAmount !== '' || digit !== '0') {
            tempAmount += digit
        }
    }
    amount = tempAmount

    if (amount.length < decimals) {
        const missing = amount.length

        for (let i = 0; i <= decimals - missing; i++) {
            amount = '0' + amount
        }
    } else if (amount.length === decimals) {
        amount = '0' + amount
    }

    return amount
}
