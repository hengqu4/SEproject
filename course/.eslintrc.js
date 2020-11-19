module.exports = {
  plugins: ['prettier'],
  extends: [require.resolve('@umijs/fabric/dist/eslint'), 'plugin:react/recommended', 'prettier', 'prettier/react'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'prettier/prettier': 2,
    'react/prop-types': 0,
    'react/display-name': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        varsIgnorePattern: '^_',
      },
    ],
  },
}
