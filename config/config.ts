import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const { UMI_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
    immer: true,
  },
  request: {},
  layout: {
    locale: true,
    ...defaultSettings,
  },
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/Loading',
  },
  targets: {
    ie: 11,
  },
  routes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[UMI_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  base: '/',
  publicPath: '/',
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  sass: {},
  webpack5: {},
  chainWebpack: (config: any) => {
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js',
      },
    ]);

    config.plugin('CompressionPlugin').use(
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        // 只处理大于xx字节 的文件，默认：0
        // 若某些文件代码体积过小 再压缩可能导致体积反增
        threshold: 10240,
        // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
        minRatio: 0.8, // 默认: 0.8
        // 是否删除源文件，默认: false
        deleteOriginalAssets: false,
      }),
    );
  },
  qiankun: {
    slave: {},
  },
});
