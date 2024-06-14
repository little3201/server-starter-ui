import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'stores': path.resolve(__dirname, 'src/stores')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    VueJsx(),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: "sass"
      })],
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      content: {
        pipeline: {
          include: [
            // the default
            /\.(vue|[jt]sx|html)($|\?)/,
            // include js/ts files
            'src/**/*.{js,ts}',
          ]
        },
      },
      presets: [
        presetUno({
          attributifyPseudo: true,
        }),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
        })
      ],
    })
  ],
})
