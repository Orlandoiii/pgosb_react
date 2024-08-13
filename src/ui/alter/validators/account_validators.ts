export function isValidAccount(value: string, bankCode: string): string {
    if (!isValidLength(value)) return ''

    if (!startsWithValidCode(value, bankCode, ['0001'])) {
        return `La cuenta debe iniciar con ${bankCode} o 0001`
    }

    if (
        value.length === 20 &&
        startsWith(value, '0001') &&
        !endsWith(value, bankCode)
    ) {
        return `La cuenta debe terminar con ${bankCode}`
    }

    return isValidAccountInternal(value) ? '' : 'La cuenta no es valida'
}

export function isValidAgentAccount(value: string, bankCode: string): string {
    if (!isValidLength(value)) return ''

    if (!startsWith(value, '0001')) {
        return 'La cuenta debe iniciar con 0001'
    }

    if (value.length === 20 && endsWith(value, bankCode)) {
        return `La cuenta debe terminar con ${bankCode}`
    }

    return isValidAccountInternal(value) ? '' : 'La cuenta no es valida'
}

export function isValidClientAccount(value: string, bankCode: string): string {
    if (!isValidLength(value)) return ''

    if (!startsWith(value, bankCode)) {
        return `La cuenta debe iniciar con ${bankCode}`
    }

    return isValidAccountInternal(value) ? '' : 'La cuenta no es valida'
}

function isValidLength(value: string): boolean {
    return value.length > 4
}

function startsWith(value: string, prefix: string): boolean {
    return value.substring(0, 4) === prefix
}

function startsWithValidCode(
    value: string,
    bankCode: string,
    validPrefixes: string[]
): boolean {
    return (
        validPrefixes.some((prefix) => startsWith(value, prefix)) ||
        startsWith(value, bankCode)
    )
}

function endsWith(value: string, suffix: string): boolean {
    return value.substring(16) === suffix
}

function isValidAccountInternal(value: string): boolean {
    if (value.length !== 20) return false

    const bankCode = value.substring(0, 4)
    const office = value.substring(4, 8)
    const controlDigit = value.substring(8, 10)
    const account = value.substring(10, 20)

    const firstDigit = getDigitValue(bankCode + office)
    const secondDigit = getDigitValue(office + account)

    return parseInt(controlDigit, 10) === firstDigit * 10 + secondDigit
}

function getDigitValue(digits: string): number {
    const weights = [3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

    let result = digits
        .split('')
        .reduce(
            (sum, digit, index) =>
                sum + parseInt(digit, 10) * weights[index % weights.length],
            0
        )

    result = 11 - (result % 11)
    return result >= 10 ? (result === 10 ? 0 : 1) : result
}
