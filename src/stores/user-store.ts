import { defineStore } from 'pinia'
import type { PrivilegeTreeNode } from 'src/types'


export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    fullName: '',
    email: '',
    avatar: '',
    accessToken: '',
    privileges: [] as PrivilegeTreeNode[]
  })
})
