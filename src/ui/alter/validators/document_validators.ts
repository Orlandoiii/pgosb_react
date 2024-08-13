const passportRegex = /^P[A-PR-WYa-pr-wy][1-9]\d\s?\d{4,9}$/
const identityCardRegex = /^[VEJ][0-9]{5,9}$/

export function isValidDocument(document: string): string {
    return passportRegex.test(document) || identityCardRegex.test(document)
        ? ''
        : 'No es un documento válido'
}
