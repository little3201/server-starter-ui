import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { constantRouterMap } from './routes'
import { useUserStore } from 'stores/user-store'
import { retrievePrivilegeTree } from 'src/api/privileges'
import type { PrivilegeTreeNode } from 'src/types'
import { signIn, getUser } from 'src/api/authentication'


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
    if (userStore.accessToken) {
      // load user info
      if (!userStore.username) {
        const res = await getUser()
        userStore.$patch({
          username: res.data.sub
        })
      }
      // load privileges
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
    } else {
      await signIn()
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
