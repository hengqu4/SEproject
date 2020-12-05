module.exports = {
  plugins: ['prettier'],
  extends: [require.resolve('@umijs/fabric/dist/eslint'), 'plugin:react-hooks/recommended'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'prettier/prettier': 2,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'react/jsx-no-bind': 0,
    'no-plusplus': 0,
    'default-case': 0,
    'react-hooks/exhaustive-deps': 1,
    'prefer-promise-reject-errors': 1,
  },
}
