import type { ITtscLintConfig } from "@ttsc/lint";

export default async () => {
  const shared = (await import("@ORGANIZATION/PROJECT-config/lint")).default;
  return {
    ...shared,
  } satisfies ITtscLintConfig;
};
