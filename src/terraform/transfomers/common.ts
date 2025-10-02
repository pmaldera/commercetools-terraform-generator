export enum ResourceNames {
    Type = 'commercetools_type',
    TaxCategory = 'commercetools_tax_category',
    TaxCategoryRate = 'commercetools_tax_category_rate'
}

export function computeString(name: string, value: string, level: number, tab: string): string {
    if(!value) return ''
    return `${tab.repeat(level)}${name} = "${value}"\n`
}

export function computeStringList(name: string, obj: string[], level: number, tab: string): string {
    if(!obj || !Array.isArray(obj)) return ''
    return `${tab.repeat(level)}${name} = ${JSON.stringify(obj)}\n`
}

export function computeBoolean(name: string, val: boolean, level: number, tab: string): string {
    if(val !== false && val !== true) return ''
    return `${tab.repeat(level)}${name} = ${val ? 'true' : 'false'}\n`
}

export function computeNumber(name: string, val: number, level: number, tab: string, radix?: number): string {
    return `${tab.repeat(level)}${name} = ${val.toString(radix)}\n`
}