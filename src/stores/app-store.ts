import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useAppStore = defineStore('app', {
  state: () => ({
    title: import.meta.env.VITE_APP_TITLE,
    isDark: useDark()
  }),
  actions: {
    setDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setTitle(title: string) {
      this.title = title
    }
  },
  persist: true
})
