import { AllowedResources, Config, Resources } from "./import";

export enum EnvVariable {
    ImportResource = 'IMPORT_RESOURCE',
    SeparateResources = "SEPERATE_RESOURCES",
    SanitizeResourceLabels = "SANITIZE_RESOURCES_LABELS",
    OutputDir = 'OUTPUT_DIR',
    CtpEnableLogs = 'CTP_ENABLE_LOGS',
    CtpAuthUrl = 'CTP_AUTH_URL',
    CtpProjectKey = 'CTP_PROJECT_KEY',
    CtpClientId = 'CTP_CLIENT_ID',
    CtpClientSecret = 'CTP_CLIENT_SECRET',
    CtpApiUrl = 'CTP_API_URL',
    CtpScopes = 'CTP_SCOPES'
}

export async function getConfig(): Promise<Config> {
    if (!process.env[EnvVariable.CtpApiUrl]) { throw Error(`Missing Commercetools API URL. Did you forget to provide the ${EnvVariable.CtpApiUrl} env variable ?`) }
    if (!process.env[EnvVariable.CtpProjectKey]) { throw Error(`Missing Commercetools Project Key. Did you forget to provide the ${EnvVariable.CtpProjectKey} env variable ?`) }
    if (!process.env[EnvVariable.CtpClientId]) { throw Error(`Missing Commercetools Client id. Did you forget to provide the ${EnvVariable.CtpClientId} env variable ?`) }
    if (!process.env[EnvVariable.CtpClientSecret]) { throw Error(`Missing Commercetools Client secret. Did you forget to provide the ${EnvVariable.CtpClientSecret} env variable ?`) }
    if (!process.env[EnvVariable.CtpAuthUrl]) { throw Error(`Missing Commercetools Client Auth URL. Did you forget to provide the ${EnvVariable.CtpAuthUrl} env variable ?`) }
    if (process.env[EnvVariable.CtpEnableLogs] && !['true', 'false'].includes(process.env[EnvVariable.CtpEnableLogs])) {
        throw Error(`Invalid ${EnvVariable.CtpEnableLogs} env variable value. Use either "true" or "false". Not providing this env variable will disable Commercetools logs.`)
    }
    if (process.env[EnvVariable.SeparateResources] && !['true', 'false'].includes(process.env[EnvVariable.SeparateResources])) {
        throw Error(`Invalid ${EnvVariable.SeparateResources} env variable value. Use either "true" or "false". Not providing this env variable will generate .tf files in a different folder for each resource type.`)
    }
    if (process.env[EnvVariable.SanitizeResourceLabels] && !['true', 'false'].includes(process.env[EnvVariable.SanitizeResourceLabels])) {
        throw Error(`Invalid ${EnvVariable.SeparateResources} env variable value. Use either "true" or "false". Not providing this env variable will generate .tf files in a different folder for each resource type.`)
    }

    const ctpScopes = process.env[EnvVariable.CtpScopes]?.trim()?.split(' ')

    if (!process.env[EnvVariable.OutputDir]) { throw Error(`Missing output directory. Did you forget to provide the ${EnvVariable.OutputDir} env variable ?`) }
    if (!process.env[EnvVariable.ImportResource]) {
        throw Error(`Missing resource to import. Did you forget to provie the ${EnvVariable.ImportResource} env variable ? You can use "${Resources.All}" to import all available ressources.`)
    }
    const resources = process.env[EnvVariable.ImportResource]?.trim()?.split(',')
    const notAllowedResources = resources.filter(r => !AllowedResources.includes(r))
    if (notAllowedResources.length > 0) {
        throw Error(`Some resource values are not supported: ${notAllowedResources.join(',')}. Here is the list of supported values: ${AllowedResources.map(ar => `"${ar}"`).join(',')}.`)
    }



    const config: Config = {
        import: {
            resource: new Set((resources as Resources[])),
            outputDir: process.env[EnvVariable.OutputDir],
            separateResources: process.env[EnvVariable.SeparateResources] === "true",
            sanitizeResourceLabels: process.env[EnvVariable.SanitizeResourceLabels] === "true",
            indentation: ' '
        },
        commercetools: {
            authMiddlewareOptions: {
                host: process.env[EnvVariable.CtpAuthUrl],
                projectKey: process.env[EnvVariable.CtpProjectKey],
                credentials: {
                    clientId: process.env[EnvVariable.CtpClientId],
                    clientSecret: process.env[EnvVariable.CtpClientSecret]
                },
                scopes: ctpScopes
            },
            httpOptions: {
                host: process.env[EnvVariable.CtpApiUrl]
            },
            enableLogs: process.env[EnvVariable.CtpEnableLogs] === "true"
        }
    }
    return config
}