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
    export async function index(
        section: string,
        input: IBbsArticle.IRequest,
    ): Promise<IPage<IBbsArticle.ISummary>> {
        // GET ENTIRE ARTICLES
        const dict = storage.get(section);
        if (dict === undefined)
            throw new NotFoundException(
                `Error on BbsArticleProvider.index(): unable to find the matched section "${section}".`,
            );

        /* disable-eslint */
        let articles: IBbsArticle[] = Array.from(dict.values()).map(
            (rec) => rec.article,
        );

        // SEARCH
        if (input.search !== undefined) {
            if (input.search.writer)
                articles = articles.filter(
                    (x) => x.writer.indexOf(input.search!.writer!) !== -1,
                );
            if (input.search.title)
                articles = articles.filter(
                    (x) =>
                        x.snapshots
                            .at(-1)!
                            .title.indexOf(input.search!.title!) !== -1,
                );
            if (input.search.body)
                articles = articles.filter(
                    (x) =>
                        x.snapshots
                            .at(-1)!
                            .body.indexOf(input.search!.body!) !== -1,
                );
        }

        // SORT
        if (input.sort?.length)
            for (const comp of input.sort.reverse())
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
                                new Date(
                                    x.snapshots.at(-1)!.created_at,
                                ).getTime() -
                                new Date(
                                    y.snapshots.at(-1)!.created_at,
                                ).getTime()
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
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            );

        // PAGINATION
        const limit: number = input.limit || 100;
        const start: number = ((input.page || 1) - 1) * limit;
        return {
            pagination: {
                current: input.page || 1,
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

    export async function find(
        section: string,
        id: string,
        password?: string,
    ): Promise<IBbsArticle> {
        const dict = storage.get(section);
        if (dict === undefined)
            throw new NotFoundException(
                `Error on BbsArticleProvider.find(): unable to find the matched section "${section}".`,
            );

        const record = dict.get(id);
        if (record === undefined)
            throw new NotFoundException(
                `Error on BbsArticleProvider.find(): unable to find the matched article "${id}".`,
            );
        else if (password !== undefined && password !== record.password)
            throw new ForbiddenException(
                `Error on BbsArticleProvider.find(): different password.`,
            );
        return record.article;
    }

    export async function store(
        section: string,
        input: IBbsArticle.IStore,
    ): Promise<IBbsArticle> {
        const now: string = datetime_to_string(new Date());
        const article: IBbsArticle = {
            id: v4(),
            section,
            writer: input.writer,
            snapshots: [
                {
                    ...{
                        ...input,
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
            section,
            () => new Map(),
        );
        dict.set(article.id, {
            article,
            password: input.password,
        });

        return article;
    }

    export async function update(
        section: string,
        id: string,
        input: IBbsArticle.IUpdate,
    ): Promise<IBbsArticle.ISnapshot> {
        const article: IBbsArticle = await find(section, id, input.password);
        const content: IBbsArticle.ISnapshot = {
            ...{
                ...input,
                password: undefined,
            },
            id: v4(),
            created_at: datetime_to_string(new Date()),
        };
        article.snapshots.push(content);
        return content;
    }
}

interface IRecord {
    article: IBbsArticle;
    password: string;
}
const storage: Map<string, Map<string, IRecord>> = new Map();

function datetime_to_string(date: Date): string {
    return (
        cipher(4)(date.getFullYear()) +
        "-" +
        ([
            [date.getMonth() + 1, date.getDate()].map(cipher(2)).join("-"),
            [date.getHours(), date.getMinutes(), date.getSeconds()]
                .map(cipher(2))
                .join(":"),
        ].join(" ") +
            "." +
            precision(date.getMilliseconds()))
    );
}

const cipher = (digit: number) => (value: number) => {
    const str: string = String(value);
    return "0".repeat(digit - str.length) + str;
};

const precision = (value: number) => {
    const str: string = String(value);
    return str + "0".repeat(3 - str.length);
};
