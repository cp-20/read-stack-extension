module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'at-rule-no-unknown': null,
    'function-url-quotes': 'always',
    'selector-class-pattern': null,
    'hue-degree-notation': 'number',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'function-no-unknown': null,
    'function-name-case': null,
  },
  overrides: [
    {
      files: ['**/*.{js,ts,jsx,tsx}'],
      customSyntax: 'postcss-jsx',
      rules: {
        'no-empty-first-line': null,
        'no-eol-whitespace': null,
        'no-missing-end-of-source-newline': null,
      },
    },
  ],
};
