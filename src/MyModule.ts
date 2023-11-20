import { Module } from "@nestjs/common";

import { BbsArticleModule } from "./controllers/bbs/BbsArticleModule";

@Module({
  imports: [BbsArticleModule],
})
export class MyModule {}
