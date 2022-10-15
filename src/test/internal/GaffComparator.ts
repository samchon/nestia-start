/* eslint-disable */

export namespace GaffComparator {
    export const strings =
        <T>(closure: (input: T) => string | string[]) =>
        (x: T, y: T) => {
            const alpha: string[] = wrap(closure(x));
            const beta: string[] = wrap(closure(y));

            for (let i: number = 0; i < alpha.length; ++i)
                if (alpha[i] !== beta[i]) return compare(alpha[i], beta[i]);
            return 0;
        };

    export const dates =
        <T>(closure: (input: T) => string | string[]) =>
        (x: T, y: T) => {
            const alpha: number[] = wrap(closure(x)).map((str) =>
                new Date(str).getTime(),
            );
            const beta: number[] = wrap(closure(y)).map((str) =>
                new Date(str).getTime(),
            );

            for (let i: number = 0; i < alpha.length; ++i)
                if (alpha[i] !== beta[i]) return alpha[i] - beta[i];
            return 0;
        };

    export const numbers =
        <T>(closure: (input: T) => number | number[]) =>
        (x: T, y: T) => {
            const alpha: number[] = wrap(closure(x));
            const beta: number[] = wrap(closure(y));

            for (let i: number = 0; i < alpha.length; ++i)
                if (alpha[i] !== beta[i]) return alpha[i] - beta[i];
            return 0;
        };

    function compare(x: string, y: string) {
        return x.localeCompare(y);
    }

    function wrap<T>(elem: T | T[]): T[] {
        return Array.isArray(elem) ? elem : [elem];
    }
}
