import { defineStore } from 'pinia'

import type { RouteRecordRaw } from 'vue-router'
import type { PrivilegeTreeNode } from '~/models'

export interface PermissionState {
  privileges: PrivilegeTreeNode[]
  routers: RouteRecordRaw[]
  menuTabRouters: RouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    privileges: [],
    routers: [],
    menuTabRouters: []
  }),
  getters: {
    getPrivileges(): PrivilegeTreeNode[] {
      return this.privileges
    },
    getRouters(): RouteRecordRaw[] {
      return this.routers
    },
    getMenuTabRouters(): RouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    setPrivileges(privileges: PrivilegeTreeNode[]) {
      this.privileges = privileges
    },
    setRouters(routers: RouteRecordRaw[]) {
      this.routers = routers
    },
    setMenuTabRouters(routers: RouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    clear(): void {
      this.setMenuTabRouters([])
      this.routers = []
    }
  },
  persist: {
    paths: ['privileges', 'menuTabRouters']
  }
})
