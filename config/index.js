'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
// const base= "http://192.168.3.4:8080"
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/upms': {
        // target: 'http://192.168.1.103:8082',
        // target: 'http://192.168.42.229:9001',
        // target: 'http://192.168.1.107:8081',
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/upms': '/upms'
        }
      },
      // '/syhz': {
      //   target: 'http://192.168.42.204:9002',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/syhz': '/syhz'
      //   }
      // },
      '/syhz': {
        target: 'http://127.0.0.1:9002',
        // target: 'http://192.168.1.103:9002',
        // target: 'http://192.168.1.107:9002',
        // target: 'http://192.168.1.102:9002',
        changeOrigin: true,
        pathRewrite: {
          '^/syhz': '/syhz'
        }
      },
      '/trajectory-search': {
        target: 'http://192.168.1.116:9003',
        changeOrigin: true,
        pathRewrite: {
          '^/trajectory-search': '/trajectory-search'
        }
      },
      '/file/downloadFile': { // MongoDB附件下载
        // target: 'http://192.168.42.204:81',
        target: 'http://192.168.43.32:9003',
        changeOrigin: true,
        pathRewrite: {
          '^/file': '/file'
        }
      },
      '/attachment': {
        // target: 'http://192.168.42.204:8084',
        target: 'http://192.168.43.32:9003',
        changeOrigin: true,
        pathRewrite: {
          '^/attachment': '/'
        }
      },
      '/file': {
        target: 'http://192.168.42.204:81',
        changeOrigin: true,
        pathRewrite: {
          '^/file': '/file'
        }
      },
      '/zdry/': {
        target: 'http://26.3.1.99:8088',
        changeOrigin: true,
        pathRewrite: {
          '^/zdry/': '/'
        }
      },
      '/upload': {
        target: 'http://192.168.42.189:9012',
        changeOrigin: true,
        pathRewrite: {
          '^/upload': '/upload'
        }
      },
      '/opt/syhz/upload/fileupload/files': {
        target: 'http://192.168.42.189:85/',
        changeOrigin: true,
        pathRewrite: {
          '^/opt/syhz/upload/fileupload/files': '/files'
        }
      },
      '/yqxx': {
        target: 'http://192.168.42.154:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/yqxx': '/'
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: '#cheap-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/', // If you are deployed on the root path, please use '/'

    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
