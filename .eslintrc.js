module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  env: {
    'es6': true,
    'browser': true,
    'node': true,
    'mocha': true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  ecmaFeatures: {
    'arrowFunctions': true,
    'destructuring': true,
    'classes': true,
    'defaultParams': true,
    'blockBindings': true,
    'modules': true,
    'objectLiteralComputedProperties': true,
    'objectLiteralShorthandMethods': true,
    'objectLiteralShorthandProperties': true,
    'restParams': true,
    'spread': true,
    'forOf': false,
    'generators': false,
    'templateStrings': true,
    'superInFunctions': true,
    'experimentalObjectRestSpread': true
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'space-before-function-paren': [0, 'always'], // 函数定义时括号前面要不要有空格
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-undefined': 0,
    'no-underscore-dangle': 0,
    'no-unexpected-multiline': 2,
    'no-unneeded-ternary': 2,
    'no-unreachable': 2,
    'no-unused-expressions': 0,
    'no-unused-vars': [2, {
      'vars': 'all',
      'args': 'none'
    }],
    'no-use-before-define': 0,
    'no-var': 0,
    'no-void': 0,
    'no-warning-comments': 0,
    'no-with': 2,
  }
}
