import { TestValidator } from "@nestia/e2e";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_at(
  connection: api.IConnection,
): Promise<void> {
  // STORE A NEW ARTICLE
  const stored: IBbsArticle = await api.functional.bbs.articles.create(
    connection,
    "general",
    {
      writer: "Robot",
      title: "Hello, world!",
      body: "Hello, I'm test automation robot",
      format: "txt",
      files: [
        {
          name: "logo",
          extension: "png",
          url: "https://somewhere.com/logo.png",
        },
      ],
      password: "1234",
    },
  );

  // ERASE IT
  await api.functional.bbs.articles.erase(
    connection,
    stored.section,
    stored.id,
    {
      password: "1234",
    },
  );
  await TestValidator.httpError("erased")(404)(() =>
    api.functional.bbs.articles.at(connection, stored.section, stored.id),
  );
}
