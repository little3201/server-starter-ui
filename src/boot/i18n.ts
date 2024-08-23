import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import { messages } from 'src/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: getLang() || 'zh-CN',
  messages
}) as I18n

function getLang() {
  const locale = localStorage.getItem('locale')
  if (locale) {
    const { lang } = JSON.parse(locale)
    return lang
  }
  return null
}
