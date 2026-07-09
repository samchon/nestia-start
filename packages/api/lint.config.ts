import type { ITtscLintConfig } from "@ttsc/lint";

export default async () => {
  const shared = (await import("@ORGANIZATION/PROJECT-config/lint.config.ts")).default;
  return {
    ...shared,
    ignores: ["src/functional/**/*.ts"],
  } satisfies ITtscLintConfig;
};
