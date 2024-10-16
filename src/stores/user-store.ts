import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { retrievePrivilegeTree } from 'src/api/privileges'
import type { PrivilegeTreeNode } from 'src/models'
import { SERVER_URL } from 'src/api/paths'
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
    access_token: null as string | null,
    privileges: [] as PrivilegeTreeNode[]
  }),
  actions: {
    async logout() {
      await api.post(SERVER_URL.LOGOUT)
      this.$reset()
    },

    /**
     * Attempt to login a user
     */
    async login(username: string, password: string) {
      // const { base64 } = useBase64(`${username}:${password}`)
      const res = await api.post(SERVER_URL.LOGIN, {}, { auth: { username, password } })
      this.$patch({
        access_token: res.data
      })
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
