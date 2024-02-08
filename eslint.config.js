const ts = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const tsParser = require("@typescript-eslint/parser");
const vitestPlugin = require("eslint-plugin-vitest");
const vitestGlobals = require("eslint-plugin-vitest-globals");
const imports = require("eslint-plugin-import");

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
      import: imports,
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,
      ...prettierConfig.rules,
      ...vitestPlugin.configs["recommended"].rules,
      ...vitestGlobals.configs["recommended"].rules,
      ...imports.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "_" },
      ],
      "import/namespace": "off",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "no-warning-comments": "error",
      "no-console": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
    },
  },
];
