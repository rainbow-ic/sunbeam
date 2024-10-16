import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    {
        files: ["src/**/*.{js,mjs,cjs,ts}"],
    },
    { languageOptions: { globals: globals.browser } },
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ["coverage/*", "dist/*", "node_modules/*"],
    },
];
