import { defineStore } from 'pinia'
import { retrievePrivilegeTree } from 'src/api/privileges'
import { signin, signout } from 'src/api/authentication'
import type { PrivilegeTreeNode } from 'src/models'
import { fetchMe } from 'src/api/users'

interface User {
  username: string
  fullName: string
  email: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    privileges: [] as PrivilegeTreeNode[]
  }),
  actions: {
    async logout() {
      // await signout()
      localStorage.removeItem('access_token')
      this.$reset()
    },

    /**
     * Attempt to login a user
     */
    async login(username: string, password: string) {
      const res = await signin(username, password)
      localStorage.setItem('access_token', res.data)

      const resp = await fetchMe()
      this.$patch({
        user: resp.data
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
