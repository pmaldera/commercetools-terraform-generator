import { TaxCategory, TaxRate, SubRate } from "@commercetools/platform-sdk"
import { computeBoolean, computeNumber, computeString, ResourceNames } from "./common"
import { GeneratorConfig } from "../../cli/import"
import { sanitizeResourceLabel } from "../utils"

enum ResourceProperties {
    Key = 'key',
    Name = 'name',
    Description = 'description',
    ResourceTypeIds = 'resource_type_ids',
    Field = 'field'
}

enum TaxCategoryRateProperties {
    Country = 'country',
    IncludedInPrice = 'included_in_price',
    TaxCategoryId = 'tax_category_id',
    Name = 'name',
    State = 'state',
    SubRate = 'sub_rate'
}

enum SubRateProperties {
    Name = 'name',
    Amount = 'amount'
}

function computeTaxCategoryRate(obj: TaxRate, config: GeneratorConfig): string {
    let toWrite = `resource "${ResourceNames.TaxCategoryRate}" "${sanitizeResourceLabel(obj.id, config.sanitizeResourceLabels)}" {\n`
    toWrite += computeBoolean(TaxCategoryRateProperties.IncludedInPrice, obj.includedInPrice, 1, config.indentation)
    toWrite += computeString(TaxCategoryRateProperties.TaxCategoryId, obj.id, 1, config.indentation)
    toWrite += computeString(TaxCategoryRateProperties.Name, obj.name, 1, config.indentation)
    toWrite += computeString(TaxCategoryRateProperties.Country, obj.country, 1, config.indentation)

    for (const subRate of obj.subRates) {
        toWrite += computeSubRate(subRate, 1, config.indentation)
    }
    toWrite += '}'
    return toWrite;
}

function computeSubRate(obj: SubRate, level: number, tab: string): string {
    let toWrite = `${tab.repeat(level)}${TaxCategoryRateProperties.SubRate} = {\n`
    toWrite += computeString(SubRateProperties.Name, obj.name, level + 1, tab)
    toWrite += computeNumber(SubRateProperties.Amount, obj.amount, level + 1, tab)
    toWrite += `${tab.repeat(level)}}\n`
    return toWrite
}

export function computeTaxCategory(obj: TaxCategory, config: GeneratorConfig): string {
    let toWrite = `resource "${ResourceNames.TaxCategory}" "${sanitizeResourceLabel(obj.key, config.sanitizeResourceLabels)}" {\n`
    toWrite += computeString(ResourceProperties.Key, obj.key, 1, config.indentation)
    toWrite += computeString(ResourceProperties.Name, obj.name, 1, config.indentation)
    toWrite += computeString(ResourceProperties.Description, obj.description, 1, config.indentation)
    toWrite += '}'

    for (const rate of obj.rates) {
        toWrite += `\n`
        toWrite += computeTaxCategoryRate(rate, config)
    }
    return toWrite;
}