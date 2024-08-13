import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRouterMap } from './routes'
import ProgressBar from "@badrap/bar-of-progress"
import { useUserStore } from '~/stores/user-store'
import type { PrivilegeTreeNode } from '~/models'

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
  const access_token = userStore.access_token
  if (access_token && access_token.length > 0) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取权限，注册路由表
      if (to.path !== '/' && !userStore.routes.length) {
        const routes = generateRoutes(userStore.privileges)

        // 动态添加可访问路由表
        userStore.updateRoutes(routes)
        routes.forEach((route) => {
          router.addRoute(route as RouteRecordRaw)
        })
        // 捕获所有未匹配的路径，放在配置的末尾
        router.addRoute({
          path: '/:cacheAll(.*)*',
          name: 'ErrorNotFound',
          component: () => import('~/pages/ErrorNotFound.vue')
        })

        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        next(nextData)
      } else {
        next()
      }
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to) => {
  progress.finish()
})


// 生成路由
const MainLayout = () => import('~/layouts/MainLayout.vue')
const BlankLayout = () => import('~/layouts/BlankLayout.vue')

const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

export const generateRoutes = (routes: PrivilegeTreeNode[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []
  for (const route of routes) {
    const data: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      component: null,
      children: []
    }
    if (route.component) {
      const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
      const component = route.component as string
      if (comModule) {
        // 动态加载路由文件
        data.component = comModule
      } else if (component.includes('#')) {
        data.component = component === '#' ? MainLayout : BlankLayout
      }
    }
    // recursive child routes
    if (route.children) {
      data.children = generateRoutes(route.children)
    }
    res.push(data)
  }
  return res
}

export default router
