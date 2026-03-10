import js from '@eslint/js'
import solid from 'eslint-plugin-solid/configs/typescript'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
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
    },
  },
)
