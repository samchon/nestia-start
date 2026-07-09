import type { ITtscLintConfig } from "@ttsc/lint";

import shared from "@ORGANIZATION/PROJECT-config/lint";

const config = {
  ...shared,
} satisfies ITtscLintConfig;

export default config;
