import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";

import api from "@ORGANIZATION/PROJECT-api/lib/index";
import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@ORGANIZATION/PROJECT-api/lib/structures/common/IPage";

export async function test_api_bbs_article_index_search(
  connection: api.IConnection,
): Promise<void> {
  // GENERATE 100 ARTICLES
  const section: string = "general";
  const articles: IBbsArticle[] = await ArrayUtil.asyncRepeat(100)(() =>
    api.functional.bbs.articles.create(connection, section, {
      writer: RandomGenerator.name(),
      title: RandomGenerator.paragraph(4)(),
      body: RandomGenerator.content(3)()(),
      format: "txt",
      files: [],
      password: RandomGenerator.alphabets(8),
    }),
  );

  // GET ENTIRE DATA
  const total: IPage<IBbsArticle.ISummary> =
    await api.functional.bbs.articles.index(connection, section, {
      limit: articles.length,
      sort: ["-created_at"],
    });

  // PREPARE SEARCH FUNCTION
  const search = TestValidator.search("BbsArticleProvider.index()")(
    async (input: IBbsArticle.IRequest.ISearch) => {
      const page: IPage<IBbsArticle.ISummary> =
        await api.functional.bbs.articles.index(connection, section, {
          limit: articles.length,
          search: input,
          sort: ["-created_at"],
        });
      return page.data;
    },
  )(total.data, 10);

  // SEARCH TITLE
  await search({
    fields: ["title"],
    values: (article) => [article.title],
    request: ([title]) => ({ title }),
    filter: (article, [title]) => article.title.includes(title),
  });

  // SEARCH WRITER
  await search({
    fields: ["writer"],
    values: (article) => [article.writer],
    request: ([writer]) => ({ writer }),
    filter: (article, [writer]) => article.writer.includes(writer),
  });

  // SEARCH BOTH OF THEM
  await search({
    fields: ["title", "writer"],
    values: (article) => [article.title, article.writer],
    request: ([title, writer]) => ({ title, writer }),
    filter: (article, [title, writer]) =>
      article.title.includes(title) && article.writer.includes(writer),
  });
}
