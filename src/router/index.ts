import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRouterMap } from './routes'
import ProgressBar from '@badrap/bar-of-progress'
import { useUserStore } from 'stores/user-store'
import type { PrivilegeTreeNode } from 'src/models'

const progress = new ProgressBar({ color: '#1677ff' })

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to, from, next) => {
  progress.start()
  const userStore = useUserStore()
  // 判断是否登录
  const accessToken = localStorage.getItem('access_token')
  if (accessToken && accessToken.length > 0) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取权限，注册路由表
      if (!to.name || !router.hasRoute(to.name)) {
        const routes = generateRoutes(userStore.privileges as PrivilegeTreeNode[])

        // 动态添加可访问路由表
        routes.forEach((route) => {
          router.addRoute(route as RouteRecordRaw)
        })
        // 捕获所有未匹配的路径，放在配置的末尾
        router.addRoute({
          path: '/:cacheAll(.*)*',
          name: 'ErrorNotFound',
          component: () => import('pages/ErrorNotFound.vue')
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
    if (to.path === '/login') {
      next()
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  progress.finish()
})

// 生成路由
const MainLayout = () => import('layouts/MainLayout.vue')
const BlankLayout = () => import('layouts/BlankLayout.vue')

const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

export const generateRoutes = (routes: PrivilegeTreeNode[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []
  for (const route of routes) {
    const data: RouteRecordRaw = {
      path: route.meta.path,
      name: route.name,
      redirect: route.meta.redirect,
      component: null,
      children: []
    }
    if (route.meta.component) {
      const comModule = modules[`../${route.meta.component}.vue`]
      const component = route.meta.component as string
      if (comModule) {
        // 动态加载路由文件
        data.component = comModule
      } else if (component.includes('#')) {
        data.component = component === '#' ? MainLayout : BlankLayout
        // data.component = BlankLayout
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
