import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { constantRouterMap } from './routes'
import ProgressBar from "@badrap/bar-of-progress"
import { useUserStore } from 'stores/modules/user'
import { usePermissionStore } from 'stores/modules/permission'
import { generateRoutesByServer } from '~/utils/routerHelper'


const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

const NO_REDIRECT_WHITE_LIST: string[] = ['/login']

const progress = new ProgressBar({ color: '#1677ff' })

router.beforeEach(async (to, from, next) => {
  progress.start()
  const userStore = useUserStore()
  // 判断是否登录
  const access_token = userStore.getAccessToken
  if (access_token && access_token.length > 0) {
    const permissionStore = usePermissionStore()
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsRoutesAdded) {
        next()
        return
      }
      const addRouters = permissionStore.getAddRouters as AppCustomRouteRecordRaw[]

      await permissionStore.generateRoutes(addRouters)

      generateRoutesByServer(addRouters).forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })

      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsRoutesAdded(true)
      next(nextData)
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 重定向到登录页
    }
  }
})

router.afterEach((to) => {
  progress.finish()
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
