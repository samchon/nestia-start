import { Module } from "@nestjs/common";

import { BbsArticleModule } from "./controllers/bbs/BbsArticleModule";
import { HealthModule } from "./controllers/health/HealthModule";

@Module({
  imports: [BbsArticleModule, HealthModule],
})
export class MyModule {}
