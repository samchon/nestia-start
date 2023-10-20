import path from "path";

export namespace MyConfiguration {
    export const API_PORT = () => 37001;

    export const ROOT = __filename.includes(
        path.join(
            "bin",
            "src",
            (() => {
                const name: string = __filename.split(path.sep).pop()!;
                return name.substring(0, name.length - 3);
            })(),
        ),
    )
        ? path.resolve(__dirname + "/../..")
        : path.resolve(__dirname + "/..");
}
