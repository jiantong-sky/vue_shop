const prodPllugins = []
if (process.env.NODE_ENV === 'production') {
  prodPllugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPllugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}