module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    // recommended typescript rules
    'plugin:@typescript-eslint/recommended',
    // extends the prettier config (disables base eslint rules so they don't conflict with prettier)
    // enables the prettier plugin (enables eslint detecting prettier errors)
    // sets the "prettier/prettier" rule to "error" (enables red-highlighting of prettier errors)
    'plugin:prettier/recommended',
    // further disable linting rules from @typescript-eslint so that prettier can handle them
    'prettier/@typescript-eslint',
    // further disable linting rules from react
    'prettier/react',
  ],
  plugins: [
    'react',
    'react-hooks',
    // accessibility linting for jsx
    'jsx-a11y',
    // better linting for ES6 import statements
    'import',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // this falsely reports imports as unused; disabling for now
    '@typescript-eslint/no-unused-vars': 'off',
    // allow typescript to infer return type of function
    '@typescript-eslint/explicit-function-return-type': 'off',
    // do not require marking class members as 'public' or 'private'
    '@typescript-eslint/explicit-member-accessibility': 'off',
    // allow non-null assertion, but we should always comment our assumptions when we use it
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
