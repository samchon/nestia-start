import api from "@ORGANIZATION/PROJECT-api/lib/index";

export const test_api_health = async (
  connection: api.IConnection,
): Promise<void> => {
  await api.functional.health(connection);
};
