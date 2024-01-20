module.exports = {
  env: {
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'google',
    'prettier',
  ],
  plugins: ['react-hooks', 'react', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    'require-jsdoc': ['off'],
    'valid-jsdoc': ['off'],
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['css'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': ['off'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-pascal-case': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
