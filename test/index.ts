import { DynamicExecutor } from "@nestia/e2e";

import api from "@ORGANIZATION/PROJECT-api";

import { Backend } from "../src/Backend";
import { Configuration } from "../src/Configuration";
import { SGlobal } from "../src/SGlobal";

async function main(): Promise<void> {
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
        parameters: () => [connection],
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
