import { RandomGenerator, TestValidator } from "@nestia/e2e";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_create(
  connection: api.IConnection,
): Promise<void> {
  // STORE A NEW ARTICLE
  const stored: IBbsArticle = await api.functional.bbs.articles.create(
    connection,
    "general",
    {
      writer: RandomGenerator.name(),
      title: RandomGenerator.paragraph(3)(),
      body: RandomGenerator.content(8)()(),
      format: "txt",
      files: [
        {
          name: "logo",
          extension: "png",
          url: "https://somewhere.com/logo.png",
        },
      ],
      password: v4(),
    },
  );

  // READ THE DATA AGAIN
  const read: IBbsArticle = await api.functional.bbs.articles.at(
    connection,
    stored.section,
    stored.id,
  );
  TestValidator.equals("created")(stored)(read);
}
