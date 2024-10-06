import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { retrievePrivilegeTree } from 'src/api/privileges'
import type { PrivilegeTreeNode } from 'src/models'

interface User {
  username: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    access_token: null as string | null,
    privileges: [] as PrivilegeTreeNode[]
  }),
  actions: {
    async logout() {
      await api.post('/logout')
      document.cookie = 'logged_in=; max-age=0;'
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
      const response = await retrievePrivilegeTree()
      this.$patch({
        privileges: response.data
      })
    }
  },
  persist: {
    paths: ['user', 'access_token', 'privileges']
  }
})
