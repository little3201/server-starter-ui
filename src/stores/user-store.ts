import { defineStore } from 'pinia'
import { api } from '~/boot/axios'
import { retrievePrivilegeTree } from '~/api/privileges'
import type { Privilege } from '~/models'
import type { RouteRecordRaw } from 'vue-router'

interface User {
  username: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    access_token: null as string | null,
    privileges: [] as Privilege[],
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    async logout() {
      await api.post('/logout')
      document.cookie = `logged_in=; max-age=0;`
      this.$reset()
    },

    /**
     * Attempt to login a user
     */
    async login(username: string, password: string) {
      const res = await api.post('/login', new URLSearchParams({ username, password }))
      this.$patch({
        user: res.data.user,
        access_token: res.data.access_token
      })
      // privileges
      const response = await retrievePrivilegeTree(username)
      this.$patch({
        privileges: response.data
      })
    },

    updateRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
    }
  },
  persist: {
    paths: ['user', 'access_token', 'privileges']
  }
})