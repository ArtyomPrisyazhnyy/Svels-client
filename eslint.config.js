import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const colorLiteralSelector = [
  'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
  'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]',
].join(',');

export default defineConfig([
  globalIgnores(['.next', 'node_modules']),
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['src/shared/**/*.{ts,tsx}', 'src/features/restaurants/**/*.{ts,tsx}'],
    ignores: [
      'src/shared/design-tokens/**',
      '**/*.test.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: colorLiteralSelector,
          message: 'Use theme CSS variables instead of raw color literals.',
        },
      ],
    },
  },
]);
