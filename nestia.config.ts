// nestia configuration file
import type sdk from "@nestia/sdk";

const NESTIA_CONFIG: sdk.INestiaConfig = {
    input: "src/controllers",
    output: "src/api",
    swagger: {
        output: "dist/swagger.json",
    },
    primitive: false,
};
export default NESTIA_CONFIG;
