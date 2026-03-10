import js from '@eslint/js'
import solid from 'eslint-plugin-solid/configs/typescript'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: ['dist', 'coverage', '.tmp-bootstrap'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  solid,
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-extra-semi': 'error',
      semi: ['error', 'never'],
    },
  },
)
