// nestia configuration file
import type sdk from "@nestia/sdk";

const NESTIA_CONFIG: sdk.INestiaConfig = {
    input: "src/controllers",
    output: "src/api",
    swagger: {
        output: "dist/swagger.json",
        servers: [
            {
                url: "http://localhost:37001",
                description: "Local Server",
            },
        ],
    },
    primitive: false,
    simulate: true,
};
export default NESTIA_CONFIG;
