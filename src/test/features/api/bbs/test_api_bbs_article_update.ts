import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_update(
    connection: api.IConnection,
): Promise<void> {
    // STORE A NEW ARTICLE
    const password: string = v4();
    const article: IBbsArticle = await api.functional.bbs.articles.store(
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
            password,
        },
    );
    typia.assertEquals(article);

    // UPDATE WITH EXACT PASSWORD
    const content: IBbsArticle.ISnapshot =
        await api.functional.bbs.articles.update(
            connection,
            article.section,
            article.id,
            {
                title: RandomGenerator.paragraph(3)(),
                body: RandomGenerator.content(8)()(),
                format: "txt",
                files: [],
                password,
            },
        );
    article.snapshots.push(typia.assertEquals(content));

    // TRY UPDATE WITH WRONG PASSWORD
    await TestValidator.error("update with wrong password")(() =>
        api.functional.bbs.articles.update(
            connection,
            article.section,
            article.id,
            {
                title: RandomGenerator.paragraph(5)(),
                body: RandomGenerator.content(8)()(),
                format: "txt",
                files: [],
                password: v4(),
            },
        ),
    );
}
