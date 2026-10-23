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
  globalIgnores([
    '.next',
    'node_modules',
    'e2e/**',
    'scripts/**',
    'next-env.d.ts',
    '**/*.test.ts',
  ]),
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Hydration gates and zustand persist listeners intentionally set state in effects.
      'react-hooks/set-state-in-effect': 'off',
      // Konva/Yandex map patterns keep callback refs in sync without re-init.
      'react-hooks/refs': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    ignores: [
      'src/shared/design-tokens/**',
      'src/shared/types/restaurant-styling.ts',
      '**/*.test.ts',
      '**/*.spec.ts',
      'e2e/**',
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
