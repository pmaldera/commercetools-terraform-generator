import { ApiRoot, ByProjectKeyRequestBuilder, ByProjectKeyTaxCategoriesRequestBuilder, ByProjectKeyTypesRequestBuilder } from "@commercetools/platform-sdk";
import { createApiRoot } from "../commercetools/client";
import { computeType } from "../terraform/transfomers/type";
import { existsSync, mkdirSync, PathLike } from "node:fs"
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { info, error } from "node:console";
import { AuthMiddlewareOptions, HttpMiddlewareOptions } from "@commercetools/ts-client";
import { computeTaxCategory } from "../terraform/transfomers/tax_category";

export enum Resources {
    Type = 'type',
    TaxCategory = 'tax_category',
    All = 'all'
}

export const AllowedResources: string[] = [Resources.Type, Resources.TaxCategory, Resources.All]

export interface Config {
    import: GeneratorConfig,
    commercetools: CtConfig
}

const CONSTANTS = {
    commercetools: {
        queryMaxLimit: 100
    },
    generator: {
        defaultTab: "  "
    }
}

interface GeneratorConfig {
    resource: Set<Resources>,
    outputDir: string,
    separateResources: boolean
}

interface CtConfig {
    authMiddlewareOptions: Omit<AuthMiddlewareOptions, "oauthUri" | "tokenCache" | "httpClient" | "httpClientOptions">,
    httpOptions: Pick<HttpMiddlewareOptions, 'host'>
    enableLogs: boolean
}

type ResourceRequestBuilder = ByProjectKeyTypesRequestBuilder | ByProjectKeyTaxCategoriesRequestBuilder
type transformerFunction = (obj: object, tab: string) => string;

function createFolderIfNotExists(path: PathLike) {
    if (!existsSync(path)) {
        try {
            info(`Dir ${path} doesn't exist, creating it.`)
            mkdirSync(path)
        } catch (e) {
            error(`Couldn't create the output directory ${path}`)
            throw e
        }
    }
}

export async function importFromCT(config: Config) {
    const apiRoot: ApiRoot = createApiRoot(config.commercetools.authMiddlewareOptions, config.commercetools.httpOptions, config.commercetools.enableLogs)

    createFolderIfNotExists(config.import.outputDir)

    const requestBuilder: ByProjectKeyRequestBuilder = apiRoot.withProjectKey({ projectKey: config.commercetools.authMiddlewareOptions.projectKey })

    for (const resource of config.import.resource) {
        switch (resource) {
            case Resources.Type:
                await importResource(config.import, requestBuilder.types(), computeType, resource)
                break
            case Resources.TaxCategory:
                await importResource(config.import, requestBuilder.taxCategories(), computeTaxCategory, Resources.TaxCategory)
                break
            case Resources.All:
                await importResource(config.import, requestBuilder.types(), computeType, Resources.Type)
                await importResource(config.import, requestBuilder.taxCategories(), computeTaxCategory, Resources.TaxCategory)
                // @todo add other importResource calls when more resource are supported.
                break
        }
    }
}

async function importResource(importConfig: GeneratorConfig, requestBuilder: ResourceRequestBuilder, tranformerFn: transformerFunction, resourceName: string) {
    let outputDir;
    let lastId = null
    let lastSize = 0

    const queryArgs = {
        limit: CONSTANTS.commercetools.queryMaxLimit,
        sort: 'id asc',
        where: undefined
    }

    if(importConfig.separateResources) {
        outputDir = path.join(importConfig.outputDir, `/${resourceName}/`)
    } else {
        outputDir = importConfig.outputDir
    }

    info(`Importing "${resourceName}" resources and generating corresponding files in ${outputDir}`)

    createFolderIfNotExists(outputDir)

    /* Gathering all resources following Commercetools documentation advices:
       https://docs.commercetools.com/api/general-concepts#iterate-over-all-elements */
    do {
        if (lastId) queryArgs.where = `id>"${lastId}"`

        const response = await requestBuilder.get(
            {
                queryArgs
            }
        ).execute()

        await Promise.allSettled(
            response.body.results.map(async (t) => {
                const outputFilePath = path.join(outputDir, `${t.key}.tf`)
                await writeFile(
                    outputFilePath,
                    tranformerFn(t, CONSTANTS.generator.defaultTab),
                    { flag: 'w' }
                ).catch(err => error(`Error will writing file ${outputFilePath}: ${err}`))
            })
        )

        lastSize = response.body.results.length
        lastId = response.body.results.at(lastSize - 1).id

    } while (lastSize === queryArgs.limit)
}