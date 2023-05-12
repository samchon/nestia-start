import { TestValidator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_at(
    connection: api.IConnection,
): Promise<void> {
    // STORE A NEW ARTICLE
    const stored: IBbsArticle = await api.functional.bbs.articles.store(
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
    typia.assertEquals(stored);

    // READ IT
    const read: IBbsArticle = await api.functional.bbs.articles.at(
        connection,
        stored.section,
        stored.id,
    );
    typia.assertEquals(read);

    // CHECK EQUALITY
    TestValidator.equals("stored vs. read")(stored)(read);

    // TRY 404 ERRORS
    await TestValidator.error("wrong section")(() =>
        api.functional.bbs.articles.at(connection, v4(), stored.id),
    );
    await TestValidator.error("wrong id")(() =>
        api.functional.bbs.articles.at(connection, stored.section, v4()),
    );
}
