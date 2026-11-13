import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'src-tauri/target']),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      boundaries,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'boundaries/include': ['src/**/*.{js,jsx,ts,tsx,css,scss}'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        { type: 'application', pattern: 'src/application', partialMatch: false },
        { type: 'domain', pattern: 'src/domain', partialMatch: false },
        { type: 'infrastructure', pattern: 'src/infrastructure', partialMatch: false },
        { type: 'presentation', pattern: 'src/presentation', partialMatch: false },
      ],
      'boundaries/files': [
        { pattern: 'src/main.tsx', category: 'entry' },
        { pattern: 'src/index.css', category: 'global-style' },
      ],
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkAllOrigins: true,
          policies: [
            {
              allow: { to: { module: { origin: ['external', 'core'] } } },
            },
            {
              from: { file: { categories: 'entry' } },
              allow: { to: { element: { type: 'app' } } },
            },
            {
              from: { file: { categories: 'entry' } },
              allow: { to: { file: { categories: 'global-style' } } },
            },
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { types: ['app', 'application', 'domain', 'infrastructure', 'presentation'] } } },
            },
            {
              from: { element: { type: 'application' } },
              allow: { to: { element: { types: ['application', 'domain'] } } },
            },
            {
              from: { element: { type: 'domain' } },
              allow: { to: { element: { type: 'domain' } } },
            },
            {
              from: { element: { type: 'infrastructure' } },
              allow: { to: { element: { types: ['infrastructure', 'application', 'domain'] } } },
            },
            {
              from: { element: { type: 'presentation' } },
              allow: { to: { element: { types: ['presentation', 'application', 'domain'] } } },
            },
            {
              from: { element: { type: 'domain' } },
              disallow: { to: { module: { origin: 'external' } } },
            },
            {
              from: { element: { types: ['application', 'infrastructure'] } },
              disallow: {
                to: {
                  module: {
                    origin: 'external',
                    source: [
                      'react',
                      'react-dom',
                      'react-dom/client',
                      'react-router-dom',
                      'vite',
                      '@vitejs/plugin-react',
                    ],
                  },
                },
              },
            },
          ],
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'no-console': [
        'error',
        {
          allow: ['info', 'error', 'warn'],
        },
      ],
    },
  },
  {
    files: ['vite.config.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
