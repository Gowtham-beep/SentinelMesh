import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import turbo from "eslint-plugin-turbo";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...js.configs.recommended.languageOptions?.globals,
        // Node globals
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        // Browser globals
        fetch: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      turbo,
    },
    rules: {
      // Disable base rule (conflicts with TS)
      "no-unused-vars": "off",
      // Enable TS-aware rule
      "@typescript-eslint/no-unused-vars": ["error"],
      "turbo/no-undeclared-env-vars": "warn",
    },
    ignores: ["dist/**", "node_modules/**"],
  },
];
