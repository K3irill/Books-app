const { env } = require('process');
const { parser, parserOptions, rules, plugins } = require('./.eslintrc');

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    module: 'readonly',
    require: 'readonly',
    __dirname: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'no-undef': 'off',
  },
  plugins: ['prettier'],
};
