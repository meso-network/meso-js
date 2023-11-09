const ts = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const tsParser = require("@typescript-eslint/parser");
const vitestPlugin = require("eslint-plugin-vitest");
const vitestGlobals = require("eslint-plugin-vitest-globals");

module.exports = [
  {
    plugins: { prettier },
  },
  {
    files: ["packages/**/*.ts"],
    ignores: ["packages/**/*.d.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.eslint.json"],
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      vitest: vitestPlugin,
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,
      ...prettierConfig.rules,
      ...vitestPlugin.configs["recommended"].rules,
      ...vitestGlobals.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "_" },
      ],
      "no-warning-comments": "error",
      "no-console": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
    },
  },
];
