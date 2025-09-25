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