import type { ITtscLintConfig } from "@ttsc/lint";

import shared from "@ORGANIZATION/PROJECT-config/lint";

const config = {
  ...shared,
  ignores: ["src/functional/**/*.ts"],
} satisfies ITtscLintConfig;

export default config;
