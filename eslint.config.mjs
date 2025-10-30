import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import filenames from "eslint-plugin-filename-rules";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// Pfad für dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Legacy-Config-Kompatibilität
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
});

export default [
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),
  ...tseslint.configs.recommended,
  {
    ignores: ["**/*", "!app/**/*"],
    plugins: {
      "filename-rules": filenames,
    },
    files: ["app/**/*.ts", "app/**/*.tsx", "src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase", "snake_case"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
      ],
      "filename-rules/match": [2, "kebab-case"],
    },
  },
  {
    files: [
      "app/_types/**/*.ts",
      "app/_types/**/*.tsx",
      "src/app/_types/**/*.ts",
      "src/app/_types/**/*.tsx",
    ],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
          suffix: ["T"],
        },
      ],
    },
  },
  {
    files: ["app/**/*.ts", "app/**/*.tsx", "src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
        },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
