import { z } from 'zod'

import { ResultErr } from '../domain/abstractions/types/resulterr'

export function mapEntity<TSource, TTarget>(
    source: TSource,
    sourceSchema: z.ZodSchema<TSource>,
    targetSchema: z.ZodSchema<TTarget>,
    mapper: (source: TSource) => TTarget
): ResultErr<TTarget> {
    try {
        const parsedSourceEntity = sourceSchema.parse(source)
        const targetEntity = mapper(parsedSourceEntity)
        targetSchema.parse(targetEntity)
        return { success: true, result: targetEntity }
    } catch (error: any) {
        console.log(`Fallo el parseo por ${error}`)
        return { success: false, error: error?.message }
    }
}
