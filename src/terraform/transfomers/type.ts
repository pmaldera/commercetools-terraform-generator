import { FieldDefinition, Type, FieldType, CustomFieldEnumValue, CustomFieldLocalizedEnumValue, LocalizedString } from "@commercetools/platform-sdk"
import { computeBoolean, computeString, computeStringList, ResourceNames } from "./common"

enum CTTypeName {
    Boolean = "Boolean",
    Date = "Date",
    Money = "Money",
    Number = "Number",
    String = "String",
    Time = "Time",
    DateTime = "DateTime",
    Set = "Set",
    Reference = "Reference",
    Enum = "Enum",
    LocalizedEnum = "LocalizedEnum"
}

enum ResourceProperties {
    Key = 'key',
    Name = 'name',
    Description = 'description',
    ResourceTypeIds = 'resource_type_ids',
    Field = 'field'
}

enum FieldProperties {
    Name = 'name',
    Label = 'label',
    Required = 'required',
    InputHint = 'input_hint'
}

enum TypeProperties {
    Type = 'type',
    ElementType = 'element_type',
    Name = 'name',
    ReferenceTypeId = 'reference_type_id',
    Value = 'value',
    LocalizedValue = 'localized_value'
}

enum EnumTypeValueProperties {
    Key = 'key',
    Label = 'label'
}

enum LocalizedEnumValueProperties {
    Key = 'key',
    Label = 'label'
}


export function computeType(obj: Type, tab: string): string {
    let toWrite = `resource "${ResourceNames.Type}" "${obj.key}" {\n`
    toWrite += computeString(ResourceProperties.Key, obj.key, 1, tab)
    toWrite += typeFunctions.computeLocalizedString(ResourceProperties.Name, obj.name, 1, tab)
    toWrite += typeFunctions.computeLocalizedString(ResourceProperties.Description, obj.description, 1, tab)
    toWrite += computeStringList(ResourceProperties.ResourceTypeIds, obj.resourceTypeIds, 1, tab)
    toWrite += `\n`

    for (const field of obj.fieldDefinitions) {
        toWrite += fieldFunctions.computeField(field, 1, tab)
    }


    toWrite += '}'
    return toWrite;
}

const typeFunctions = {
    computeLocalizedString: function(name: string, obj: LocalizedString, level: number, tab) {
        if(!obj) return ''
        let toWrite = `${tab.repeat(level)}${name} = {\n`
        for(const prop in obj) {
            toWrite += `${tab.repeat(level + 1)}${prop} = "${obj[prop]}"\n`
        }
        toWrite += `${tab.repeat(level)}}\n`

        return toWrite
    },
}

const fieldFunctions = {
    computeStringMap: function(name: string, obj: LocalizedString, level: number, tab: string) {
        if(!obj) return ''
        let toWrite = `${tab.repeat(level)}${name} = {\n`
        for(const prop in obj) {
            toWrite += `${tab.repeat(level + 1)}${prop} = "${obj[prop]}"\n`
        }
        toWrite += `${tab.repeat(level)}}\n`
        return toWrite
    },
    computeField: function(obj: FieldDefinition, level: number, tab: string) {
        let toWrite = `${tab.repeat(level)}${ResourceProperties.Field} {\n`
        toWrite += computeString(FieldProperties.Name, obj.name, level + 1, tab)
        toWrite += fieldFunctions.computeStringMap(FieldProperties.Label, obj.label, level + 1, tab)
        toWrite += computeBoolean(FieldProperties.Required, obj.required, level + 1, tab)
        toWrite += fieldFunctions.computeType(obj.type, level + 1, tab)
        toWrite += computeString(FieldProperties.InputHint, obj.inputHint, level + 1, tab)
        toWrite += `${tab.repeat(level)}}\n\n`
        return toWrite
    },
    computeType: function(obj: FieldType, level: number, tab: string, elementType = false) {
        if(!obj || !obj.name) return ''
        let toWrite = `${tab.repeat(level)}${!elementType ? TypeProperties.Type : TypeProperties.ElementType} {\n`
        toWrite += computeString(TypeProperties.Name, obj.name, level + 1, tab)
        if (obj.name === CTTypeName.Enum) {
            toWrite += fieldFunctions.computeEnumTypeValues(obj.values, level + 1, tab)
        } else if (obj.name === CTTypeName.LocalizedEnum) {
            toWrite += fieldFunctions.computeLocalizedEnumTypeValues(obj.values, level + 1, tab)
        } else if (obj.name === CTTypeName.Reference) {
            toWrite += computeString(TypeProperties.ReferenceTypeId, obj.referenceTypeId, level + 1, tab)
        } else if (obj.name === CTTypeName.Set) {
            toWrite += fieldFunctions.computeType(obj, level + 1, tab, true)
        }

        toWrite += `${tab.repeat(level)}}\n`
        return toWrite
    },

    computeEnumTypeValues: function(obj: CustomFieldEnumValue[], level: number, tab: string) {
        if(!obj || !Array.isArray(obj)) return ''
        let toWrite = ''
        for (const entry of obj) {
            toWrite += `${tab.repeat(level)}${TypeProperties.Value} {\n`
            toWrite += computeString(EnumTypeValueProperties.Key, entry.key, level + 1, tab)
            toWrite += computeString(EnumTypeValueProperties.Label, entry.label, level + 1, tab)
            toWrite += `${tab.repeat(level)}}\n`
        }
        return toWrite
    },
    computeLocalizedEnumTypeValues: function(obj: CustomFieldLocalizedEnumValue[], level: number, tab: string) {
        if(!obj || !Array.isArray(obj)) return ''
        let toWrite = ''
        for (const entry of obj) {
            toWrite += `${tab.repeat(level)}${TypeProperties.LocalizedValue} {\n`
            toWrite += computeString(LocalizedEnumValueProperties.Key, entry.key, level + 1, tab)
            toWrite += `${tab.repeat(level + 1)}${LocalizedEnumValueProperties.Label} = {\n`
            for (const lang in entry.label) {
                toWrite += computeString(lang, entry.label[lang], level + 2, tab) 
            }
            toWrite += `${tab.repeat(level + 1)}}\n`
            toWrite += `${tab.repeat(level)}}\n`
        }
        return toWrite
    }
}