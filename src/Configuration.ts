import path from "path";

export namespace Configuration {
    export const API_PORT = async () => 37001;

    export const ROOT = __filename.includes(
        path.join("bin", "src", "ShoppingConfiguration"),
    )
        ? path.resolve(__dirname + "/../..")
        : path.resolve(__dirname + "/..");
}
