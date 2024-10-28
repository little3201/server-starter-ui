import { defineStore } from 'pinia'
import { retrievePrivilegeTree } from 'src/api/privileges'
import { fetchMe } from 'src/api/users'
import { signin, signout } from 'src/api/authentication'
import type { PrivilegeTreeNode } from 'src/models'

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
      await signout()
      localStorage.removeItem('access_token')
      this.$reset()
    },

    /**
     * Attempt to login a user
     */
    async login(username: string, password: string) {
      const res = await signin(username, password)
      if (res.status === 200) {
        localStorage.setItem('access_token', res.data)
        const [userResp, privilegesResp] = await Promise.all([fetchMe(), retrievePrivilegeTree()])
        // 执行结果处理
        this.$patch({
          user: userResp.data.user,
          privileges: privilegesResp.data
        })
      }
    }
  },
  persist: {
    paths: ['user', 'access_token', 'privileges']
  }
})
