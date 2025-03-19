import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import checker from 'vite-plugin-checker'


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'src': fileURLToPath(new URL('src', import.meta.url)),
      'components': fileURLToPath(new URL('src/components', import.meta.url)),
      'layouts': fileURLToPath(new URL('src/layouts', import.meta.url)),
      'pages': fileURLToPath(new URL('src/pages', import.meta.url)),
      'assets': fileURLToPath(new URL('src/assets', import.meta.url)),
      'boot': fileURLToPath(new URL('src/boot', import.meta.url)),
      'stores': fileURLToPath(new URL('src/stores', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/css/element/index.scss" as *;',
        api: 'modern-compiler',
      }
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
      dts: 'src/components.d.ts',
    }),
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
    checker({
      vueTsc: true,
      eslint: {
        lintCommand: 'eslint -c ./eslint.config.js "./src/**/*.{js,mjs,cjs,ts,vue}"',
        useFlatConfig: true
      }
    })
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
