import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'

import zhCN from '~/locales/zh-CN'
import en from '~/locales/en'

const messages = {
  'en': en,
  'zh-CN': zhCN
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

type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}

export const t: I18nGlobalTranslation = (key: string) => {
  if (!i18n || !i18n.global.t) {
    return key
  }

  if (!key) return ''

  return (i18n.global.t as any)(key)
}

export const i18n = createI18n({
  legacy: false,
  locale: getLang() || 'zh-CN',
  messages: messages,
}) as I18n

export const setupI18n = async (app: App<Element>) => {
  app.use(i18n)
}

function getLang() {
  const locale = localStorage.getItem('locale')
  if (locale) {
    const { lang } = JSON.parse(locale)
    return lang
  }
  return undefined
}
