import path from 'path';
import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {
    loading: '@/components/LoadingCp',
  },
  dva: {
    immer: true,
  },
  devtool: 'source-map',
  antd: {},
  title: '低代码编辑器',
  // exportStatic: {},
  base: '/',
  publicPath: '/',
  outputPath: 'dist',
  esbuild: {},
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/home',
        },
        {
          path: '/editor',
          component: '../pages/editor',
        },
        {
          path: '/mobileTip',
          component: '../pages/mobileTip',
        },
        {
          path: '/preview',
          component: '../pages/editor/preview',
        },
      ],
    },
  ],
  theme: {
    'primary-color': 'red',
    // "btn-primary-bg": "#2F54EB"
  },
  extraBabelPlugins: [['import', { libraryName: 'zarm', style: true }]],
  // sass: {},
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    assets: path.resolve(__dirname, 'src/assets/'),
  },
  proxy: {
    '/api': {
      target: 'http://10.61.209.130:3000/', //对应自己的接口
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
});
