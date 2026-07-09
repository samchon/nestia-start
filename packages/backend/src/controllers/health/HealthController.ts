import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

@Controller("health")
export class HealthController {
  /**
   * Health check endpoint.
   *
   * @returns `JSON.stringify("OK")`
   */
  @TypedRoute.Get()
  public health(): string {
    return "OK";
  }
}
