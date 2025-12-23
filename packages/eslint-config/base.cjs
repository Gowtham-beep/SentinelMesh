module.exports = {
  env: {
    node: true,
    es2021: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint', 'turbo'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  rules: {
    // Disable base rule (conflicts with TS)
    'no-unused-vars': 'off',

    // Enable TS-aware rule
    '@typescript-eslint/no-unused-vars': ['error'],

    'turbo/no-undeclared-env-vars': 'warn',
  },

  ignorePatterns: ['dist/**'],
};
