import { DynamicExecutor } from "@nestia/e2e";

import api from "@ORGANIZATION/PROJECT-api";

import { Backend } from "../src/Backend";
import { Configuration } from "../src/Configuration";
import { SGlobal } from "../src/SGlobal";
import { ArgumentParser } from "./helpers/ArgumentParser";

interface IOptions {
    include?: string[];
    exclude?: string[];
}

const getOptions = () =>
    ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
        // command.option("--mode <string>", "target mode");
        // command.option("--reset <true|false>", "reset local DB or not");
        command.option("--include <string...>", "include feature files");
        command.option("--exclude <string...>", "exclude feature files");

        prompt;

        return action(async (options) => {
            // if (typeof options.reset === "string")
            //     options.reset = options.reset === "true";
            // options.mode ??= await prompt.select("mode")("Select mode")([
            //     "LOCAL",
            //     "DEV",
            //     "REAL",
            // ]);
            // options.reset ??= await prompt.boolean("reset")("Reset local DB");
            return options as IOptions;
        });
    });

async function main(): Promise<void> {
    const options: IOptions = await getOptions();
    SGlobal.testing = true;

    // BACKEND SERVER
    const backend: Backend = new Backend();
    await backend.open();

    //----
    // CLINET CONNECTOR
    //----
    // DO TEST
    const connection: api.IConnection = {
        host: `http://127.0.0.1:${await Configuration.API_PORT()}`,
    };
    const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
        prefix: "test",
        parameters: () => [
            {
                host: connection.host,
                encryption: connection.encryption,
            },
        ],
        filter: (func) =>
            (!options.include?.length ||
                (options.include ?? []).some((str) => func.includes(str))) &&
            (!options.exclude?.length ||
                (options.exclude ?? []).every((str) => !func.includes(str))),
    })(__dirname + "/features");

    await backend.close();

    const failures: DynamicExecutor.IReport.IExecution[] =
        report.executions.filter((exec) => exec.error !== null);
    if (failures.length === 0) {
        console.log("Success");
        console.log("Elapsed time", report.time.toLocaleString(), `ms`);
    } else {
        for (const f of failures) console.log(f.error);
        process.exit(-1);
    }
}
main().catch((exp) => {
    console.log(exp);
    process.exit(-1);
});
