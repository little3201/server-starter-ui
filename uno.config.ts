import {
  defineConfig,
  presetIcons,
  presetUno
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      preflight: false
    }),
    presetIcons({
      scale: 1.25
    })
  ]
})
