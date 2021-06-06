module.exports = {
    // 关闭 eslintrc 语法检查
    lintOnSave: false,
    // 自定义打包入口文件
    chainWebpack: config => {
        // 生产环境
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                'vue-quill-editor': 'VueQuillEditor',
                nprogress: 'NProgress',
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        });
        // 开发环境
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        });
    }
}