import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_store(
    connection: api.IConnection,
): Promise<void> {
    // STORE A NEW ARTICLE
    const stored: IBbsArticle = await api.functional.bbs.articles.store(
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
    typia.assertEquals(stored);

    // READ THE DATA AGAIN
    const read: IBbsArticle = await api.functional.bbs.articles.at(
        connection,
        stored.section,
        stored.id,
    );
    typia.assertEquals(read);

    // CHECK EXISTENCE
    if (read.id !== stored.id)
        throw new Error("Bug on BbsArticleProvider.store(): failed to store.");
}
