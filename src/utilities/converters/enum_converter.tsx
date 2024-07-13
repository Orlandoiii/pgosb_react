export function EnumToStringArray<T extends Record<string, unknown>>(
    enums: T
): string[] {
    return Object.values(enums).filter((value) => typeof value === 'string')
}
