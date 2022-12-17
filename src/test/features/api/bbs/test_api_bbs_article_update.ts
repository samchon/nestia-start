import typia from "typia";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

import { RandomGenerator } from "../../../internal/RandomGenerator";
import { exception_must_be_thrown } from "../../../internal/exception_must_be_thrown";

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
            title: RandomGenerator.paragraph(),
            body: RandomGenerator.content(),
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
    const content: IBbsArticle.IContent =
        await api.functional.bbs.articles.update(
            connection,
            article.section,
            article.id,
            {
                title: RandomGenerator.paragraph(),
                body: RandomGenerator.content(),
                format: "txt",
                files: [],
                password,
            },
        );
    article.contents.push(typia.assertEquals(content));

    // TRY UPDATE WITH WRONG PASSWORD
    await exception_must_be_thrown("update with wrong password", () =>
        api.functional.bbs.articles.update(
            connection,
            article.section,
            article.id,
            {
                title: RandomGenerator.paragraph(),
                body: RandomGenerator.content(),
                format: "txt",
                files: [],
                password: v4(),
            },
        ),
    );
}
