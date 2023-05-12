import core from "@nestia/core";
import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import cp from "child_process";
import fs from "fs";
import path from "path";

import { Configuration } from "./Configuration";

export class Backend {
    private application_?: NestFastifyApplication;

    public async open(): Promise<void> {
        //----
        // OPEN THE BACKEND SERVER
        //----
        // MOUNT CONTROLLERS
        this.application_ = await NestFactory.create(
            await core.DynamicModule.mount(__dirname + "/controllers"),
            new FastifyAdapter(),
            { logger: false },
        );

        // DO OPEN
        this.application_.enableCors();
        await this.swagger(this.application_);
        await this.application_.listen(await Configuration.API_PORT());

        //----
        // POST-PROCESSES
        //----
        // INFORM TO THE PM2
        if (process.send) process.send("ready");

        // WHEN KILL COMMAND COMES
        process.on("SIGINT", async () => {
            await this.close();
            process.exit(0);
        });
    }

    public async close(): Promise<void> {
        if (this.application_ === undefined) return;

        // DO CLOSE
        await this.application_.close();
        delete this.application_;
    }

    private async swagger(app: NestFastifyApplication): Promise<void> {
        // CREATE DIRECTORY
        const splitted: string[] = __dirname.split(path.sep);
        const location: string =
            splitted.at(-1) === "src" && splitted.at(-2) === "bin"
                ? __dirname + "/../../dist"
                : __dirname + "/../dist";
        if (fs.existsSync(location) === false)
            await fs.promises.mkdir(location);

        // BUILD SWAGGER
        cp.execSync("npm run build:swagger");

        // OPEN SWAGGER
        await app.register(require("@fastify/swagger"), {
            mode: "static",
            specification: {
                path: `${location}/swagger.json`,
            },
        });
        await app.register(require("@fastify/swagger-ui"), {
            routePrefix: "/docs",
        });
    }
}
