import typia from "typia";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";

import { ArrayUtil } from "../../../../utils/ArrayUtil";
import { GaffComparator } from "../../../internal/GaffComparator";
import { RandomGenerator } from "../../../internal/RandomGenerator";
import { validate_index_sort } from "../../../internal/validate_index_sort";

export async function test_api_bbs_article_index_sort(
    connection: api.IConnection,
): Promise<void> {
    // GENERATE 100 ARTICLES
    const section: string = "general";
    const articles: IBbsArticle[] = await ArrayUtil.asyncRepeat(100, () =>
        api.functional.bbs.articles.store(connection, section, {
            writer: RandomGenerator.name(),
            title: RandomGenerator.paragraph(),
            body: RandomGenerator.content(),
            format: "txt",
            files: [],
            password: RandomGenerator.alphabets(8),
        }),
    );
    typia.assertEquals(articles);

    // PREPARE VALIDATOR
    const validator = validate_index_sort("BbsArticleProvider.idex()")(
        (input: IBbsArticle.IRequest) =>
            api.functional.bbs.articles.index(connection, section, input),
    );

    // DO VALIDATE
    const components = [
        validator("created_at")(GaffComparator.dates((x) => x.created_at)),
        validator("updated_at")(GaffComparator.dates((x) => x.updated_at)),
        validator("title")(GaffComparator.strings((x) => x.title)),
        validator("writer")(GaffComparator.strings((x) => x.writer)),
        validator(
            "writer",
            "title",
        )(GaffComparator.strings((x) => [x.writer, x.title])),
    ];
    for (const comp of components) {
        await comp("+");
        await comp("-");
    }
}
