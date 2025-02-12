import { defineStore } from 'pinia'
import { login, logout } from 'src/api/authentication'
import { fetchMe } from 'src/api/users'
import { retrievePrivilegeTree } from 'src/api/privileges'
import type { PrivilegeTreeNode } from 'src/models'


export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    fullName: '',
    email: '',
    avatar: '',
    privileges: [] as PrivilegeTreeNode[]
  }),
  actions: {
    async signout() {
      const res = await logout()
      if (res.status === 200) {
        this.$reset()
      }
    },

    /**
     * Attempt to login a user
     */
    async signin(username: string, password: string) {
      await login(username, password)
      const [userResp, privilegesResp] = await Promise.all([fetchMe(), retrievePrivilegeTree()])
        // 执行结果处理
        this.$patch({
          username: userResp.data.sub,
          privileges: privilegesResp.data
        })
    }
  }
})
