const OFF = 0

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  rules: {},
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        'vue/multi-word-component-names': OFF
      }
    }
  ]
}
