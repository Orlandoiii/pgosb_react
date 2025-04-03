/**
 * Utility functions for consistent string handling between client and server
 */

/**
 * Normalizes a string to ensure consistent length calculation between client and server.
 * This function:
 * 1. Normalizes Unicode characters (NFC normalization form)
 * 2. Trims whitespace
 * 3. Removes invisible control characters
 *
 * @param value The string to normalize
 * @returns Normalized string with consistent length calculation
 */
export function normalizeString(value: string): string {
    if (!value) return ''

    // Normalize Unicode representation (NFC = Normalization Form Canonical Composition)
    const normalized = value.normalize('NFC')

    // Trim whitespace and remove invisible control characters
    return normalized.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
}

/**
 * Gets the normalized length of a string to ensure consistent length calculation
 * between client and server
 *
 * @param value The string to measure
 * @returns Normalized string length
 */
export function getNormalizedLength(value: string): number {
    return normalizeString(value).length
}
