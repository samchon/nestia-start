import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@ORGANIZATION/PROJECT-api/lib/structures/common/IPage";

export async function test_api_bbs_article_index_search(
    connection: api.IConnection,
): Promise<void> {
    // GENERATE 100 ARTICLES
    const section: string = "general";
    const articles: IBbsArticle[] = await ArrayUtil.asyncRepeat(100, () =>
        api.functional.bbs.articles.store(connection, section, {
            writer: RandomGenerator.name(),
            title: RandomGenerator.paragraph(4)(),
            body: RandomGenerator.content(3)()(),
            format: "txt",
            files: [],
            password: RandomGenerator.alphabets(8),
        }),
    );
    typia.assertEquals(articles);

    // DO SEARCH
    const validator = search(connection)(articles);
    await validator(
        "writer",
        (x) => x.writer,
        (elem, word) => elem.writer.indexOf(word) !== -1,
    );
    await validator(
        "title",
        (x) => x.contents.at(-1)!.title,
        (elem, word) => elem.contents.at(-1)!.title.indexOf(word) !== -1,
    );
    await validator(
        "body",
        (x) => x.contents.at(-1)!.body,
        (elem, word) => elem.contents.at(-1)!.body.indexOf(word) !== -1,
    );
}

const search =
    (connection: api.IConnection) =>
    (total: IBbsArticle[]) =>
    async (
        field: "writer" | "title" | "body",
        getter: (
            record: IBbsArticle,
            input: IBbsArticle.IRequest.ISearch,
        ) => string,
        filter: (record: IBbsArticle, word: string) => boolean,
    ): Promise<void> => {
        const input: IBbsArticle.IRequest = {
            limit: total.length,
            search: {},
        };
        const value: string = getter(
            RandomGenerator.pick(total),
            input.search!,
        );
        input.search![field] = value;

        const matched: IBbsArticle[] = total.filter((elem) =>
            filter(elem, value),
        );
        const page: IPage<IBbsArticle.ISummary> =
            await api.functional.bbs.articles.index(
                connection,
                "general",
                input,
            );
        typia.assertEquals(page);

        TestValidator.index(
            `BbsArticleProvider.index() with ${field} searching`,
        )(matched)(page.data);
    };
