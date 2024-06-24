import { defineStore } from 'pinia'
import { constantRouterMap } from '~/router/routes'
import {
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '~/utils/routerHelper'
import { cloneDeep } from 'lodash-es'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isRoutesAdded: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isRoutesAdded: false, // 标识是否已经添加过路由
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsRoutesAdded(): boolean {
      return this.isRoutesAdded
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(routers?: AppCustomRouteRecordRaw[]) {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []

        // 过滤菜单
        routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])

        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },
    setIsRoutesAdded(state: boolean): void {
      this.isRoutesAdded = state
    },
    setAddRouters(routers: AppCustomRouteRecordRaw[]):void {
      this.addRouters = routers
    },
    clear(): void {
      this.setIsRoutesAdded(false)
      this.setMenuTabRouters([])
      this.routers = []
      this.addRouters = []
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})
