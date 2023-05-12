import path from "path";

export namespace Configuration {
    export const API_PORT = async () => 37001;

    export const PROJECT_DIR = (() => {
        const splitted: string[] = __dirname.split(path.sep);
        return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
            ? path.resolve(__dirname + "/../..")
            : path.resolve(__dirname + "/..");
    })();
}
