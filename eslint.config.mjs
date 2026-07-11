import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        allowStaticOnly: true,
      },
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: false,
        ignoreComments: false,
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'array-bracket-spacing': [
      'error',
      'always',
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'array-bracket-newline': [
      'error',
      'always',
    ],
    'array-element-newline': [
      'error',
      'always',
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: 'never',
        ExportDeclaration: 'never',
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'function-paren-newline': [
      'error',
      'multiline-arguments',
    ],
    'function-call-argument-newline': [
      'error',
      'consistent',
    ],
    'multiline-ternary': [
      'error',
      'always',
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'vue/html-quotes': [
      'error',
      'double',
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        multiline: 'below',
        singleline: 'beside',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        multiline: {
          max: 1,
        },
        singleline: {
          max: 1,
        },
      },
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
      },
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 1,
      },
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
      },
    ],
  },
});
