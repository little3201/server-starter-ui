import { defineStore } from 'pinia'
import { useTagsViewStore } from './tagsView'
import router from '~/router'
import type {User} from '~/models'

interface UserState {
  user?: User
  access_token: string | undefined
  role?: string
  rememberMe: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      user: undefined,
      access_token: undefined,
      role: undefined,
      // 记住我
      rememberMe: false
    }
  },
  getters: {
    getAccessToken(): string | undefined {
      return this.access_token
    },
    getUser(): User | undefined {
      return this.user
    },
    getRole(): string | undefined {
      return this.role
    },
    getRememberMe(): boolean {
      return this.rememberMe
    }
  },
  actions: {
    setAccessToken(access_token: string | undefined) {
      this.access_token = access_token
    },
    setUser(user?: User) {
      this.user = user
    },
    setRole(role: string | undefined) {
      this.role = role
    },
    setRememberMe(rememberMe: boolean): boolean {
      return this.rememberMe = rememberMe
    },
    clear() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setAccessToken(undefined)
      this.setUser(undefined)
      this.setRole(undefined)
      this.setRememberMe(false)
      // 跳转 login
      router.replace('/login')
    }
  },
  persist: true
})