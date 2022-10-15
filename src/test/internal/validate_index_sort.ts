import { is_sorted } from "tstl/ranges/algorithm/sorting";

import { IPage } from "@ORGANIZATION/PROJECT-api/lib/structures/common/IPage";

export const validate_index_sort =
    (method: string) =>
    <T extends object, Fields extends string>(
        getter: (
            input: IPage.IRequest & {
                sort?: IPage.IRequest.Sort<Fields>;
            },
        ) => Promise<IPage<T>>,
    ) =>
    (...fields: Fields[]) =>
    (comp: (x: T, y: T) => number, filter?: (elem: T) => boolean) =>
    async (direction: "+" | "-") => {
        const page: IPage<T> = await getter({
            limit: 100,
            sort: fields.map((field) => `${direction}${field}` as const),
        });
        if (filter) page.data = page.data.filter(filter);

        const reversed: typeof comp =
            direction === "+" ? comp : (x, y) => comp(y, x);
        if (is_sorted(page.data, (x, y) => reversed(x, y) < 0) === false) {
            console.log(direction, ...fields);
            if (
                fields.length === 1 &&
                page.data.length &&
                (page.data as any)[0][fields[0]] !== undefined
            )
                console.log(page.data.map((elem) => (elem as any)[fields[0]]));
            throw new Error(
                `Bug on ${method}: wrong sorting on ${direction}(${fields.join(
                    ", ",
                )}).`,
            );
        }
    };
