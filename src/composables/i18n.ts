import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'

import zhCN from '~/locales/zh-CN'
import en from '~/locales/en'

function getLang() {
  const locale = localStorage.getItem('locale')
  if (locale) {
    const { lang } = JSON.parse(locale)
    return lang
  }
  return undefined
}

const messages = {
  'en': en,
  'zh-CN': zhCN
}

export const i18n = createI18n({
  legacy: false,
  locale: getLang() || 'zh-CN',
  messages: messages,
}) as I18n

export const setupI18n = async (app: App<Element>) => {
  app.use(i18n)
}

export const localeMap = [
  {
    lang: 'zh-CN',
    name: '简体中文'
  },
  {
    lang: 'en',
    name: 'English'
  }
]