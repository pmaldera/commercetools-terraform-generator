import { Channel } from "@commercetools/platform-sdk"
import { computeAddress, computeCoordinates, computeCustomFields, computeLocalizedString, computeString, computeStringList, ResourceNames } from "./common"
import { sanitizeResourceLabel } from "../utils"
import { GeneratorConfig } from "../../cli/import"

enum ResourceProperties {
    Key = 'key',
    Roles = 'roles',
    Address = 'address',
    Custom = 'custom',
    Description = 'description',
    Geolocaltion = 'geolocation',
    name = 'name'
}

export function computeChannel(obj: Channel, config: GeneratorConfig): string {
    let toWrite = `resource "${ResourceNames.Channel}" "${sanitizeResourceLabel(obj.key, config.sanitizeResourceLabels)}" {\n`
    toWrite += computeString(ResourceProperties.Key, obj.key, 1, config.indentation)
    toWrite += computeStringList(ResourceProperties.Roles, obj.roles, 1, config.indentation)
    toWrite += computeAddress(ResourceProperties.Address, obj.address, 1, config.indentation)
    toWrite += computeCustomFields(ResourceProperties.Custom, obj.custom, 1, config.indentation)
    toWrite += computeLocalizedString(ResourceProperties.Description, obj.description, 1, config.indentation)
    toWrite += computeCoordinates(ResourceProperties.Geolocaltion, obj.geoLocation, 1, config.indentation)
    toWrite += computeLocalizedString(ResourceProperties.name, obj.name, 1, config.indentation)
    toWrite += '}'

    return toWrite
}