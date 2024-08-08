import { z, ZodTypeAny } from 'zod'

export function zodEmpty(): any {
    return z.string().length(0).default('')
}

export function zodEmptyOr(option: ZodTypeAny): any {
    return z.string().length(0).or(option).default('')
}

export function zodEmptyOrGreaterThan(minLength: number): any {
    return z.string().length(0).or(z.string().min(minLength)).default('')
}
