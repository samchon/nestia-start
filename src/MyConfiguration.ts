import fs from "fs";
import path from "path";

import { MyGlobal } from "./MyGlobal";

export namespace MyConfiguration {
  export const API_PORT = () => Number(MyGlobal.env.PROJECT_API_PORT);

  export const ROOT = (() => {
    const splitted: string[] = __dirname.split(path.sep);
    return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
      ? path.resolve(__dirname + "/../..")
      : fs.existsSync(__dirname + "/.env")
        ? __dirname
        : path.resolve(__dirname + "/..");
  })();
}
