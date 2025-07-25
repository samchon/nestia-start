/**
 * @packageDocumentation
 * @module api.functional
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

export * as bbs from "./bbs";

/**
 * Health check endpoint.
 *
 * @returns `JSON.stringify("OK")`
 *
 * @controller HealthController.health
 * @path GET /health
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function health(connection: IConnection): Promise<health.Output> {
  return true === connection.simulate
    ? health.simulate(connection)
    : PlainFetcher.fetch(connection, {
        ...health.METADATA,
        template: health.METADATA.path,
        path: health.path(),
      });
}
export namespace health {
  export type Output = string;

  export const METADATA = {
    method: "GET",
    path: "/health",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = () => "/health";
  export const random = (): string => typia.random<string>();
  export const simulate = (connection: IConnection): Output => {
    connection;
    return random();
  };
}
