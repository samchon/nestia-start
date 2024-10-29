import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { v4 } from "uuid";

import { IBbsArticle } from "@ORGANIZATION/PROJECT-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@ORGANIZATION/PROJECT-api/lib/structures/common/IPage";

import { MapUtil } from "../../utils/MapUtil";

/**
 * This is a fake provider.
 *
 * Remove it or change it to be stored on the real DB.
 */
export namespace BbsArticleProvider {
  export async function index(props: {
    section: string;
    input: IBbsArticle.IRequest;
  }): Promise<IPage<IBbsArticle.ISummary>> {
    // GET ENTIRE ARTICLES
    const dict = storage.get(props.section);
    if (dict === undefined)
      throw new NotFoundException(
        `Error on BbsArticleProvider.index(): unable to find the matched section "${props.section}".`,
      );

    /* disable-eslint */
    let articles: IBbsArticle[] = Array.from(dict.values()).map(
      (rec) => rec.article,
    );

    // SEARCH
    if (props.input.search !== undefined) {
      if (props.input.search.writer)
        articles = articles.filter(
          (x) => x.writer.indexOf(props.input.search!.writer!) !== -1,
        );
      if (props.input.search.title)
        articles = articles.filter(
          (x) =>
            x.snapshots.at(-1)!.title.indexOf(props.input.search!.title!) !==
            -1,
        );
      if (props.input.search.body)
        articles = articles.filter(
          (x) =>
            x.snapshots.at(-1)!.body.indexOf(props.input.search!.body!) !== -1,
        );
    }

    // SORT
    if (props.input.sort?.length)
      for (const comp of props.input.sort.reverse())
        articles.sort((x, y) => {
          const sign = comp[0];
          const column = comp.substring(1);
          const closure = () => {
            if (column === "created_at")
              return (
                new Date(x.created_at).getTime() -
                new Date(y.created_at).getTime()
              );
            else if (column === "updated_at")
              return (
                new Date(x.snapshots.at(-1)!.created_at).getTime() -
                new Date(y.snapshots.at(-1)!.created_at).getTime()
              );
            else if (column === "writer")
              return x.writer.localeCompare(y.writer);
            else
              return x.snapshots
                .at(-1)!
                .title.localeCompare(y.snapshots.at(-1)!.title);
          };
          return sign === "+" ? closure() : -closure();
        });
    else
      articles.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    // PAGINATION
    const limit: number = props.input.limit ?? 100;
    const start: number = ((props.input.page ?? 1) - 1) * limit;
    return {
      pagination: {
        current: props.input.page ?? 1,
        limit: limit,
        records: articles.length,
        pages: Math.ceil(articles.length / limit),
      },
      data: articles.slice(start, start + limit).map((article) => ({
        id: article.id,
        section: article.section,
        writer: article.writer,
        title: article.snapshots.at(-1)!.title,
        created_at: article.created_at,
        updated_at: article.snapshots.at(-1)!.created_at,
      })),
    };
  }

  export async function find(props: {
    section: string;
    id: string;
    password?: string;
  }): Promise<IBbsArticle> {
    const dict = storage.get(props.section);
    if (dict === undefined)
      throw new NotFoundException(
        `Error on BbsArticleProvider.find(): unable to find the matched section "${props.section}".`,
      );

    const record = dict.get(props.id);
    if (record === undefined)
      throw new NotFoundException(
        `Error on BbsArticleProvider.find(): unable to find the matched article "${props.id}".`,
      );
    else if (props.password !== undefined && props.password !== record.password)
      throw new ForbiddenException(
        `Error on BbsArticleProvider.find(): different password.`,
      );
    return record.article;
  }

  export async function create(props: {
    section: string;
    input: IBbsArticle.ICreate;
  }): Promise<IBbsArticle> {
    const now: string = new Date().toISOString();
    const article: IBbsArticle = {
      id: v4(),
      section: props.section,
      writer: props.input.writer,
      snapshots: [
        {
          ...{
            ...props.input,
            password: undefined,
          },
          id: v4(),
          created_at: now,
        },
      ],
      created_at: now,
    };

    const dict: Map<string, IRecord> = MapUtil.take(
      storage,
      props.section,
      () => new Map(),
    );
    dict.set(article.id, {
      article,
      password: props.input.password,
    });
    return article;
  }

  export async function update(props: {
    section: string;
    id: string;
    input: IBbsArticle.IUpdate;
  }): Promise<IBbsArticle.ISnapshot> {
    const article: IBbsArticle = await find({
      section: props.section,
      id: props.id,
      password: props.input.password,
    });
    const content: IBbsArticle.ISnapshot = {
      ...{
        ...props.input,
        password: undefined,
      },
      id: v4(),
      created_at: new Date().toISOString(),
    };
    article.snapshots.push(content);
    return content;
  }

  export async function erase(props: {
    section: string;
    id: string;
    input: IBbsArticle.IErase;
  }): Promise<void> {
    await find({
      section: props.section,
      id: props.id,
      password: props.input.password,
    });
    storage.get(props.section)!.delete(props.id);
  }
}

interface IRecord {
  article: IBbsArticle;
  password: string;
}
const storage: Map<string, Map<string, IRecord>> = new Map();
