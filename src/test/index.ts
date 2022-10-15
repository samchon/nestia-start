import { sleep_for } from "tstl/thread/global";

import api from "@ORGANIZATION/PROJECT-api";

import { Backend } from "../Backend";
import { Configuration } from "../Configuration";
import { DynamicImportIterator } from "./internal/DynamicImportIterator";

async function main(): Promise<void> {
    // BACKEND SERVER
    const backend: Backend = new Backend();
    await backend.open();

    //----
    // CLINET CONNECTOR
    //----
    // DO TEST
    const connection: api.IConnection = {
        host: `http://127.0.0.1:${await Configuration.API_PORT()}`,
        encryption: await Configuration.ENCRYPTION_PASSWORD(),
    };
    const exceptions: Error[] = await DynamicImportIterator.force(
        __dirname + "/features",
        {
            prefix: "test",
            parameters: () => [connection],
        },
    );

    // WAIT FOR A WHILE FOR THE EVENTS
    await sleep_for(2500);

    // TERMINATE
    await backend.close();

    if (exceptions.length === 0) console.log("Success");
    else {
        for (const exp of exceptions) console.log(exp);
        process.exit(-1);
    }
}
main().catch((exp) => {
    console.log(exp);
    process.exit(-1);
});
