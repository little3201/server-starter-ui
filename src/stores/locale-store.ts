import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    lang: 'zh-CN'
  }),
  actions: {
    changeLang(lang: string) {
      this.lang = lang
    }
  },
  persist: true
})
