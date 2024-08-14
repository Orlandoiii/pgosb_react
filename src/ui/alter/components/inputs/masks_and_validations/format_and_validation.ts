import { formatDate, formatDateTime } from '../../../formatters/date_formatters'
import {
    formatAsDecimal,
    formatAsInt,
} from '../../../formatters/number_formatters'
import {
    isValidAccount,
    isValidAgentAccount,
    isValidClientAccount,
} from '../../../validators/account_validators'
import { isValidDocument } from '../../../validators/document_validators'
import { isValidEmail } from '../../../validators/email_validators'
import { isValidIP } from '../../../validators/ip_validators'

const AlphabeticChars = '[a-zA-Z]'
const NumericChars = '\\d'
const SpaceChar = '\\s'
const DotChar = '\\.'

export type InputType =
    | 'Ip'
    | 'Amount'
    | 'Account'
    | 'Integer'
    | 'Decimal'
    | 'AgentAccount'
    | 'ClientAccount'
    | 'DocumentId'
    | 'Any'
    | 'Text'
    | 'Email'
    | 'Date'
    | 'DateTime'

export function formatAndValidate(
    value: string,
    type: InputType,
    mustStart: string = '',
    validator?: (value: string) => { isValid: boolean; error: string }
): { isValid: boolean; error: string; value: string } {
    try {
        const cleanedValue = cleanValue(value, type)
        const formatedValue = formatValue(value, cleanedValue, type)
        const validationResult = validateValue(formatedValue, mustStart, type)

        // if (validationResult.isValid && validator) {
        //   return { ...validator(formatedValue), value: formatedValue };
        // }

        return { ...validationResult, value: formatedValue }
    } catch (error: any) {
        return { isValid: false, error: error?.message, value: '' }
    }
}

function cleanValue(value: string, type: InputType): string {
    let regex: RegExp
    switch (type) {
        case 'Ip':
            regex = new RegExp(`[^${NumericChars}${DotChar}]`, 'g')
            break
        case 'Amount':
        case 'Decimal':
        case 'Account':
        case 'Integer':
        case 'AgentAccount':
        case 'ClientAccount':
            regex = new RegExp(`[^${NumericChars}]`, 'g')
            break
        case 'DocumentId':
            regex = new RegExp(`[^${AlphabeticChars}]`, 'g')
            break
        case 'Text':
            regex = new RegExp(`[^${AlphabeticChars}${SpaceChar}]`, 'g')
            break
        default:
            return value
    }

    return value.replace(regex, '')
}

function formatValue(
    initValue: string,
    value: string,
    type: InputType
): string {
    switch (type) {
        case 'Amount':
        case 'Decimal':
            return formatAsDecimal(value, initValue)
        case 'Integer':
            return formatAsInt(value)
        case 'Date':
            return formatDate(value, '13/08/2024', '13/08/2025')
        case 'DateTime':
            return formatDateTime(
                value,
                '13/08/2024 00:00:00',
                '13/08/2025 23:59:59'
            )
        default:
            return value
    }
}

function validateValue(
    value: string,
    bankCode: string,
    type: InputType
): { isValid: boolean; error: string } {
    var error: string = ''

    switch (type) {
        case 'Email':
            error = isValidEmail(value)
            break
        case 'Ip':
            error = isValidIP(value)
            break
        case 'Account':
            error = isValidAccount(value, bankCode)
            break
        case 'AgentAccount':
            error = isValidAgentAccount(value, bankCode)
            break
        case 'ClientAccount':
            error = isValidClientAccount(value, bankCode)
            break
        case 'DocumentId':
            error = isValidDocument(value)
            break
        default:
            error = ''
    }

    return { isValid: error === '', error: error }
}
