import path from "path";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import reactJsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const gitIgnorePath = path.resolve("./.gitignore");

const typescriptFiles = "**/*.{ts,tsx}";
const allFiles = "**/*.{mjs,js,ts,tsx}";

export default tseslint.config(
  // Default config for node and browser
  {
    files: [allFiles],
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: { ...globals["shared-node-browser"] } },
  },

  // Import definitions
  {
    files: [typescriptFiles],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      "import/internal-regex": "^~/",
      "import/parser": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
          project: ["tsconfig.vite.json"],
        },
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          "newlines-between": "always",
        },
      ],
    },
  },

  // React config
  {
    files: [typescriptFiles],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs["recommended-latest"],
      reactJsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      ...reactJsxA11y.flatConfigs.recommended.languageOptions,
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        {
          name: "Link",
          linkAttributes: "to",
        },
        {
          name: "NavLink",
          linkAttributes: "to",
        },
      ],
    },
    rules: {
      "react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary"] }],
    },
  },

  // Ignore all files in gitignore
  includeIgnoreFile(gitIgnorePath),

  // Support for prettier in eslint
  prettier,
  prettierConfig,
);
