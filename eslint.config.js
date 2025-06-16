import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      'dist/**',
      'build/**',
      '.env*',
      '*.min.js',
      'coverage/**',
      '.azure/**',
      '.git/**',
      '**/*.json',
      '**/*.md',
      '**/*.yaml',
      '**/*.yml',
      '**/*.sh',
      '**/*.bicep',
      '**/*.bicepparam',
    ],
  },

  // Main configuration for JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // ESLint recommended rules only
      ...js.configs.recommended.rules,

      // Prettier integration
      'prettier/prettier': 'error',

      // Allow console.log for demo purposes
      'no-console': 'off',

      // Allow unused vars that start with underscore (common for demos)
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier configuration (should be last)
  prettier,
];
