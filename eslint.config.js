import globals from 'globals';
import js from '@eslint/js';

// Parser
import tsParser from '@typescript-eslint/parser';

// Plugins
import tsEsLint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooksEsLint from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tsEsLint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parser: tsParser,
    },
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
    plugins: {
      react,
      'react-hooks': reactHooksEsLint,
      prettier,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      semi: [2, 'always'],
      ...reactHooksEsLint.configs.recommended.rules,
    },
  },
];
