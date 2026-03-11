import js from '@eslint/js'
import solid from 'eslint-plugin-solid/configs/typescript'
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes'
import { defineConfig } from 'eslint/config'
import type { Linter } from 'eslint'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const solidFlatConfig = solid as unknown as Linter.FlatConfig

export default defineConfig(
  {
    ignores: ['dist', 'coverage', '.tmp-bootstrap'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  solidFlatConfig,
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'tailwind-canonical-classes': tailwindCanonicalClasses,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-extra-semi': 'error',
      semi: ['error', 'never'],
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'error',
        {
          cssPath: './src/index.css',
          rootFontSize: 16,
        },
      ],
    },
  },
)
