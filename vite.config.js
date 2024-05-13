import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';
// import postCssPxToRem from './vite/plugins/postCssPxToRem';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // 环境变量
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = env;
  return {
    base: VITE_BASE_URL,
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': resolve(__dirname, './src/'),
      },
    },
    css: {
      preprocessorOptions: {
        javascriptEnabled: true,
        less: {
          additionalData: `@import '/src/styles/vars.less';`,
        },
      },
      // postcss: {
      //   plugins:[
      //     // postCssPxToRem(),
      //   ]
      // },
    },
    // 配置代理
    server: {
      host: '0.0.0.0',
      port: 9527,
      hmr: true,
      // open: true, //自动打开
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:9001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        'ant-design-vue/es/locale/zh_CN',
      ],
    },
    build: {
      target: 'es2017',
      minify: 'esbuild',
      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: Object.is(VITE_DROP_CONSOLE, 'true'),
      //   },
      // },
      esbuild: {
        pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
        supported: {
          // https://github.com/vitejs/vite/pull/8665
          'top-level-await': true,
        },
      },
      //指定输出路径
      outDir: 'dist',
      //生成静态资源的存放路径
      assetsDir: 'assets',
      //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      //启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      //构建后是否生成 source map 文件
      sourcemap: false,
      //自定义底层的 Rollup 打包配置
      rollupOptions: {
        input: {
          //可以配置多个，表示多入口
          index: resolve(__dirname, 'index.html')
          // project:resolve(__dirname,"project.html")
        },
        output: {
          // chunkFileNames:'static/js/[name]-[hash].js',
          // entryFileNames:"static/js/[name]-[hash].js",
          // assetFileNames:"static/[ext]/name-[hash].[ext]"
        }
      },
      //默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      //chunk 大小警告的限制
      chunkSizeWarningLimit: 500,
    },
  }
});
