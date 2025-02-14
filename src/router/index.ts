import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { constantRouterMap } from './routes'
import { useUserStore } from 'stores/user-store'
import { retrievePrivilegeTree } from 'src/api/privileges'
import type { PrivilegeTreeNode } from 'src/types'
import { signIn, getUser } from 'boot/auth-service'


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
  const userStore = useUserStore()

  if (to.path === '/callback') {
    next()
  } else {
    if (!userStore.username || userStore.username === '') {
      const user = await getUser()
      if (user && user.access_token) {
        userStore.$patch({
          username: user.profile.sub,
          accessToken: user.access_token
        })
        if (user.expired) {
          await signIn()
        }
      } else {
        await signIn()
      }
      await handleRouteAddition(userStore, to, from, next)
    } else {
      await handleRouteAddition(userStore, to, from, next)
    }
  }

})

/**
 * 检查权限，并配置路由
 * @param userStore user store
 * @param to router to
 * @param from router from
 * @param next  router next
 */
const handleRouteAddition = async (userStore: ReturnType<typeof useUserStore>, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (!userStore.privileges.length) {
    const privilegesResp = await retrievePrivilegeTree();
    const privileges = privilegesResp.data;
    userStore.$patch({ privileges });
  }
  if (!to.name || !router.hasRoute(to.name)) {
    const routes = generateRoutes(userStore.privileges)
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
