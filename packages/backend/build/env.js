const fs = require("fs");
const path = require("path");

const env = path.join(__dirname, "../.env");
const local = path.join(__dirname, "../.env.local");

if (fs.existsSync(env) === false) fs.copyFileSync(local, env);
