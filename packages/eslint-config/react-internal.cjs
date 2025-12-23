module.exports = {
  extends: [
    '@repo/eslint-config/base',
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
