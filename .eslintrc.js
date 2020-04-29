// http://eslint.org/docs/user-guide/configuring

module.exports = {
  globals: {
    $: true,
    jQuery: true,
  },
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],

  // required to lint *.vue files
  plugins: ['vue'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // add your custom rules here
  rules: {
    semi: [2, 'never'],
    indent: ['error', 2],
    'vue/max-attributes-per-line': 'off',
    'no-console': 'off',
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js'],
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'linebreak-style': 0,
  },
}
