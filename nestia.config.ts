// nestia configuration file
import type sdk from "@nestia/sdk";

const NESTIA_CONFIG: sdk.INestiaConfig = {
    input: "src/controllers",
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
    primitive: false,
    simulate: true,
    e2e: "test",
};
export default NESTIA_CONFIG;
