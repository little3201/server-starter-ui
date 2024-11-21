import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      preflight: false
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.25
    })
  ]
})
