module.exports = {
    root: true,
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json"
    },
    overrides: [
        {
            files: ["src/**/*.ts"],
            rules: {
                "@typescript-eslint/no-duplicate-imports": "error",
                "@typescript-eslint/no-floating-promises": "error"
            }
        }
    ]
};