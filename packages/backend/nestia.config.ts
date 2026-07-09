// nestia configuration file
import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { MyModule } from "./src/MyModule";

export default {
  input: () => NestFactory.create(MyModule),
  output: "../api/src",
  swagger: {
    output: "../api/swagger.json",
    servers: [
      {
        url: "http://localhost:37001",
        description: "Local Server",
      },
    ],
    beautify: true,
  },
  keyword: true,
  simulate: true,
  primitive: false,
} satisfies INestiaConfig;
