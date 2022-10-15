import TSON from "typescript-json";
import { v4 } from "uuid";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

import { exception_must_be_thrown } from "../../../internal/exception_must_be_thrown";

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
    TSON.assertEquals(stored);

    // READ IT
    const read: IBbsArticle = await api.functional.bbs.articles.at(
        connection,
        stored.section,
        stored.id,
    );
    TSON.assertEquals(read);

    // CHECK EQUALITY
    if (api.Primitive.equal_to(stored, read) === false)
        throw new Error("Bug on BbsArticleProvider.at(): different data.");

    // TRY 404 ERRORS
    await exception_must_be_thrown("wrong section", () =>
        api.functional.bbs.articles.at(connection, v4(), stored.id),
    );
    await exception_must_be_thrown("wrong id", () =>
        api.functional.bbs.articles.at(connection, stored.section, v4()),
    );
}
