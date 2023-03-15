import core from "@nestia/core";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import cp from "child_process";
import express from "express";
import fs from "fs";

import { Configuration } from "./Configuration";

export class Backend {
    private application_?: INestApplication;
    private is_closing_: boolean = false;

    public async open(): Promise<void> {
        //----
        // OPEN THE BACKEND SERVER
        //----
        // MOUNT CONTROLLERS
        this.application_ = await NestFactory.create(
            await core.DynamicModule.mount(__dirname + "/controllers"),
            { logger: false },
        );

        // CONFIGURATIONS
        this.is_closing_ = false;
        this.application_.enableCors();
        this.application_.use(this.middleware.bind(this));

        // DO OPEN
        this.swagger(this.application_).catch((exp) => {
            console.log(exp);
        });
        await this.application_.listen(await Configuration.API_PORT());

        //----
        // POST-PROCESSES
        //----
        // INFORM TO THE PM2
        if (process.send) process.send("ready");

        // WHEN KILL COMMAND COMES
        process.on("SIGINT", async () => {
            this.is_closing_ = true;
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

    private middleware(
        _request: express.Request,
        response: express.Response,
        next: FunctionLike,
    ): void {
        if (this.is_closing_ === true) response.set("Connection", "close");
        next();
    }

    private async swagger(app: INestApplication): Promise<void> {
        // CREATE DIRECTORY
        const location: string = __dirname + "/../dist";
        if (fs.existsSync(location) === false)
            await fs.promises.mkdir(location);

        // BUILD SWAGGER
        cp.execSync("npm run build:swagger");

        // OPEN SWAGGER
        const docs = require(location + "/swagger.json");
        SwaggerModule.setup("__swagger__", app, docs);
    }
}

type FunctionLike = (...args: any[]) => any;
