import path from "path";

export namespace MyConfiguration {
    export const API_PORT = () => 37001;

    export const ROOT = (() => {
        const splitted: string[] = __dirname.split(path.sep);
        return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
            ? path.resolve(__dirname + "/../..")
            : path.resolve(__dirname + "/..");
    })();
}
