import { Module } from "@nestjs/common";

import { HealthController } from "./HealthController";

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
