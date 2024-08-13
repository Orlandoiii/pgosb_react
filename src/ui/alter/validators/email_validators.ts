export function isValidEmail(email: string): string {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailPattern.test(email) ? '' : 'No es un correo válido'
}
