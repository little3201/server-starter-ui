import { defineStore } from 'pinia'
import { ComponentSize } from 'element-plus'
import { useDark } from '@vueuse/core'

interface AppState {
  tagsView: boolean
  greyMode: boolean
  isDark: boolean,
  title: string
  currentSize: ComponentSize
  sizeMap: ComponentSize[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      title: import.meta.env.VITE_APP_TITLE, // 标题
      tagsView: true, // 标签页
      isDark: false, // 是否是暗黑模式
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日

      currentSize: 'default', // 组件尺寸
      sizeMap: ['default', 'large', 'small']
    }
  },
  getters: {
    getTagsView(): boolean {
      return this.tagsView
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getTitle(): string {
      return this.title
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    }
  },
  actions: {
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setTitle(title: string) {
      this.title = title
    },
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize
    },
    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
    }
  },
  persist: true
})