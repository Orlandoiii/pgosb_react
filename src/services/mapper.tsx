import { z } from 'zod'

export function mapEntity<TSource, TTarget>(
    source: TSource,
    sourceSchema: z.ZodSchema<TSource>,
    targetSchema: z.ZodSchema<TTarget>,
    mapper: (source: TSource) => TTarget
): { success: boolean; result?: TTarget; error?: string } {
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
