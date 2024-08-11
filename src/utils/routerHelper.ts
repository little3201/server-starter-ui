import type { RouteRecordRaw } from 'vue-router'
import type { PrivilegeTreeNode } from '~/models'

const MainLayout = () => import('~/layouts/MainLayout.vue')
const BlankLayout = () => import('~/layouts/BlankLayout.vue')

const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

// 路由生成
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
      if (comModule || component.includes('#')) {
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

export const pathResolve = (parentPath: string, path: string) => {
  if (!path) return ''
  const childPath = path.startsWith('/') ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}
