import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      pages: path.resolve(__dirname, 'src/pages'),
      assets: path.resolve(__dirname, 'src/assets'),
      boot: path.resolve(__dirname, 'src/boot'),
      stores: path.resolve(__dirname, 'src/stores')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/css/element/index.scss" as *;'
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })]
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8760',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
