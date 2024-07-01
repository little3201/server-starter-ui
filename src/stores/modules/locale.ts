import { defineStore } from 'pinia'

interface LocaleState {
  lang: string
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => {
    return {
      lang: 'zh-CN'
    }
  },
  getters: {
    getLang(): string {
      return this.lang
    }
  },
  actions: {
    setLang(lang: string) {
      this.lang = lang
    }
  },
  persist: true
})