import { info, error } from "node:console";
import { getConfig } from "./cli";
import { Config, importFromCT } from "./import";

(async () => {
    try {
        const config:Config = await getConfig()
        await importFromCT(config)
        info(`Generation completed.`)
        process.exitCode = 0
    } catch (e) {
        error(e.message)
        process.exitCode = 1
    }
})()
