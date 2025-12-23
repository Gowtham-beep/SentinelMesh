module.exports = {
  env: {
    node: true,
    es2021: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['turbo', 'only-warn'],

  extends: [
    'eslint:recommended',
    'prettier',
  ],

  rules: {
    'turbo/no-undeclared-env-vars': 'warn',
  },

  ignorePatterns: ['dist/**'],
};
