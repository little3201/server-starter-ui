import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import type { I18n } from 'vue-i18n'
import { messages } from 'src/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: Cookies.get('lang') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
}) as I18n
