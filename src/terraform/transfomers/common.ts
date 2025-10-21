import { Address, CustomFields, GeoJsonPoint, LocalizedString } from "@commercetools/platform-sdk"
import { isEmptyObject } from "../utils"

export enum ResourceNames {
    Channel = 'commercetools_channel',
    Type = 'commercetools_type',
    TaxCategory = 'commercetools_tax_category',
    TaxCategoryRate = 'commercetools_tax_category_rate',
}

enum AddressBlockProperties {
    AdditionalAddressInfo = 'additional_address_info',
    AdditionalStreetInfo = 'additional_street_info',
    Appartment = 'appartment',
    Building = 'building',
    City = 'city',
    Company = 'company',
    Depatment = 'department',
    Email = 'email',
    ExternalId = 'external_id',
    Fax = 'fax',
    FirstName = 'first_name',
    Key = 'key',
    LastName = 'last_name',
    Mobile = 'mobile',
    Phone = 'phone',
    PoBox = 'po_box',
    PostalCode = 'postal_code',
    Region = 'region',
    Salutation = 'salutation',
    State = 'state',
    StreetName = 'street_name',
    StreetNumber = 'street_number',
    Title = 'title'
}

enum CustomFieldsBlockProperties {
    TypeId = 'type_id',
    Fields = 'fields'
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

export function computeLocalizedString(name: string, obj: LocalizedString, level: number, tab) {
    if(!obj) return ''
    let toWrite = `${tab.repeat(level)}${name} = {\n`
    for(const prop in obj) {
        toWrite += `${tab.repeat(level + 1)}${prop} = "${obj[prop]}"\n`
    }
    toWrite += `${tab.repeat(level)}}\n`

    return toWrite
}

export function computeCoordinates(name: string, obj: GeoJsonPoint, level: number, tab) {
    if (isEmptyObject(obj)) return ''
    if (obj.coordinates.length != 2) return ''
    if (obj.coordinates.some(val => !Number.isSafeInteger(val))) return ''

    return `${tab.repeat(level)}${name} = [${obj.coordinates.join(', ')}}`
}

export function computeCustomFields(name: string = 'custom', val: CustomFields, level: number, tab: string): string  {
    if(isEmptyObject(val)) return ''
    if(!val.type?.id) return ''

    let toWrite = `${tab.repeat(level)}${name} {`
    toWrite += computeString(CustomFieldsBlockProperties.TypeId, val.type.id, level + 1, tab)
    toWrite += `${tab.repeat(level)}${name} = jsonencode(${JSON.stringify(val.fields)})\n`
    toWrite += `${tab.repeat(level)}${name}}`
    return toWrite
}

export function computeAddress(name: string = 'address', val: Address, level: number, tab: string): string {
    if(isEmptyObject(val)) return ''

    let toWrite = `${tab.repeat(level)}${name} {`
    toWrite += computeString(AddressBlockProperties.AdditionalAddressInfo, val.additionalAddressInfo, level + 1, tab)
    toWrite += computeString(AddressBlockProperties.AdditionalStreetInfo, val.additionalStreetInfo, level + 1, tab)
    toWrite += computeString(AddressBlockProperties.Appartment, val.apartment, level + 1, tab)
    toWrite += computeString(AddressBlockProperties.Building, val.building, level + 1, tab)
    toWrite += computeString(AddressBlockProperties.City, val.city, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Company, val.company, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Depatment, val.department, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Email, val.email, level +1, tab)
    toWrite += computeString(AddressBlockProperties.ExternalId, val.externalId, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Fax, val.fax, level +1, tab)
    toWrite += computeString(AddressBlockProperties.FirstName, val.firstName, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Key, val.key, level +1, tab)
    toWrite += computeString(AddressBlockProperties.LastName, val.lastName, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Mobile, val.mobile, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Phone, val.phone, level +1, tab)
    toWrite += computeString(AddressBlockProperties.PoBox, val.pOBox, level +1, tab)
    toWrite += computeString(AddressBlockProperties.PostalCode, val.postalCode, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Region, val.region, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Salutation, val.salutation, level +1, tab)
    toWrite += computeString(AddressBlockProperties.State, val.state, level +1, tab)
    toWrite += computeString(AddressBlockProperties.StreetName, val.streetName, level +1, tab)
    toWrite += computeString(AddressBlockProperties.StreetNumber, val.streetNumber, level +1, tab)
    toWrite += computeString(AddressBlockProperties.Title, val.title, level +1, tab)
    toWrite += `${tab.repeat(level)}${name}}`

    return toWrite
}