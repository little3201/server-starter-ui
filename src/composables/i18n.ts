import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import { useStorage } from '~/hooks/web/useStorage'

import zhCN from '~/locales/zh-CN'
import en from '~/locales/en'

const { getStorage } = useStorage('localStorage')

const messages = {
  'en': en, 
  'zh-CN': zhCN
}

export const i18n = createI18n({
  legacy: false,
  locale: getStorage('lang') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: messages,
})  as I18n

export const setupI18n = async (app: App<Element>) => {
  app.use(i18n)
}