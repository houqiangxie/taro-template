/*
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-10-12 10:24:00
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-18 14:47:15
 */
import path from 'node:path'
// 导入unocss
import UnoCSS from 'unocss/webpack'
import ComponentsPlugin from 'unplugin-vue-components/webpack'
import NutUIResolver from '@nutui/nutui-taro/dist/resolver'
import AutoImport from 'unplugin-auto-import/webpack'
const config = {
  projectName: 'taro-template',
  date: '2023-10-12',
  designWidth(input) {
    // 配置 NutUI 375 尺寸
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375
    }
    // 全局使用 Taro 默认的 750 尺寸
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-html',
    [
    'tarojs-router-next-plugin',
    {
      ignore: ['api']
    }
    ]],
  // 配置全局 Scss 变量
  sass: {
    resource: [
      path.resolve(__dirname, '..', 'src/assets/styles/custom_theme.scss')
    ],
    // 默认京东 APP 10.0主题 > @import "@nutui/nutui-taro/dist/styles/variables.scss";
    // 京东科技主题 > @import "@nutui/nutui-taro/dist/styles/variables-jdt.scss";
    // 京东B商城主题 > @import "@nutui/nutui-taro/dist/styles/variables-jdb.scss";
    // 京东企业业务主题 > @import "@nutui/nutui-taro/dist/styles/variables-jddkh.scss";
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`
  },
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'vue3',
  // compiler: 'webpack5',
  compiler: {
    type:'webpack5',
    prebundle: {
      exclude: ['tarojs-router-next'],
      enable: false,
    }
  },
  alias: {
    '@': path.resolve(__dirname, '..','src')
  },
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve('babel-loader')
                }
              }
            }
          }
        }
      })
      chain.plugin('unocss').use(UnoCSS())
      chain.plugin('unplugin-vue-components').use(ComponentsPlugin({
        resolvers: [NutUIResolver({ taro: true })],
        dts: 'src/types/components.d.ts',
      }))
      chain.plugin('unplugin-auto-import').use(AutoImport({
        dirs: ['src/composables'],
        dts: 'src/types/auto-imports.d.ts',
      }))
      // https://github.com/unocss/unocss
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    devServer: {
      port: 8081,
    },
    router: {
      mode: 'browser', // 或者是 'hash'
      // basename:'/'
    },
    // 合并webpack配置
    webpackChain(chain) {
      // https://github.com/unocss/unocss
      chain.plugin('unocss').use(UnoCSS())
      chain.plugin('unplugin-vue-components').use(ComponentsPlugin({
        resolvers: [NutUIResolver({ taro: true })],
        dts: 'src/types/components.d.ts',
      }))
      chain.plugin('unplugin-auto-import').use(AutoImport({
        dirs: ['src/composables'],
        dts: 'src/types/auto-imports.d.ts',
      }))
    },
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
