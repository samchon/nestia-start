// nestia configuration file
import type sdk from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { MyModule } from "./src/MyModule";

const NESTIA_CONFIG: sdk.INestiaConfig = {
    input: async () => NestFactory.create(await MyModule()),
    output: "src/api",
    swagger: {
        output: "packages/api/swagger.json",
        servers: [
            {
                url: "http://localhost:37001",
                description: "Local Server",
            },
        ],
    },
    distribute: "packages/api",
    simulate: true,
    e2e: "test",
};
export default NESTIA_CONFIG;
