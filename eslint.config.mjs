// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default tseslint.config(
  {
    ignores: ["dist/**", "**.config.**"],
  },
  {
    rules: {'prettier/prettier': 'error'},
    plugins: {
      prettier: eslintPluginPrettier
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
