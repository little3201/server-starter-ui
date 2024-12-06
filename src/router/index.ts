import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRouterMap } from './routes'
import { useUserStore } from 'stores/user-store'
import type { PrivilegeTreeNode } from 'src/models'

// Lazy load layout
const BlankLayout = () => import('layouts/BlankLayout.vue')
const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// Router guard for authentication and dynamic route registration
router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('access_token')
  const userStore = useUserStore()

  if (accessToken && accessToken.length > 0 && Object.keys(userStore.user || {}).length > 0) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!to.name || !router.hasRoute(to.name)) {
        const routes = generateRoutes(userStore.privileges as PrivilegeTreeNode[])
        routes.forEach((route) => {
          router.addRoute('home', route as RouteRecordRaw)
        })
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
      next(`/login?redirect=${to.path}`)
    }
  }
})

/**
 * Generate routes dynamically based on user privileges
 * @param {PrivilegeTreeNode[]} routes - Array of privilege tree nodes
 * @returns {RouteRecordRaw[]} - Array of route records
 */
export const generateRoutes = (routes: PrivilegeTreeNode[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []
  for (const route of routes) {
    const item: RouteRecordRaw = {
      path: route.meta.path,
      name: route.name,
      redirect: route.meta.redirect as string,
      component: null,
      children: []
    }
    if (route.meta.component) {
      const comModule = modules[`../${route.meta.component}.vue`]
      const component = route.meta.component as string
      if (comModule) {
        item.component = comModule
      } else if (component.includes('#')) {
        item.component = BlankLayout
      }
    }
    if (route.children) {
      item.children = generateRoutes(route.children)
    }
    res.push(item)
  }
  return res
}

export default router
