const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  tabWidth: 2,
  htmlWhitespaceSensitivity: 'css',
  jsxBracketSameLine: false,
  singleQuote: true,
  bracketSpacing: true,
  jsxSingleQuote: true,
  endOfLine: 'auto',
  printWidth: 120,
  semi: false,
}
