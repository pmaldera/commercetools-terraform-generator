export function isEmptyObject(obj: object): boolean {
    if (!obj) return true
    if (typeof obj !== 'object') return true
    if (Object.keys(obj).length === 0) return true // Acceptable O(n) complexity
    return false
}

export function sanitizeResourceLabel(input: string, sanitize:boolean, replacing: string = '-'): string {
    if (!sanitize) return input
    if(!input[0].match(/[a-zA-Z]/g)) input = '_' + input
    return (sanitize ? input.replaceAll(/[^\w-]/g, replacing).toLowerCase() : input)
}