import type { RouteRecordRaw } from 'vue-router'
import type { PrivilegeTreeNode } from '~/models'

const MainLayout = () => import('~/layouts/MainLayout.vue')
const BlankLayout = () => import('~/layouts/BlankLayout.vue')

const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

// 路由生成
export const generateRoutesByServer = (routes: PrivilegeTreeNode[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []
  for (const route of routes) {
    const data: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: {
        icon: route.icon,
        hidden: route.hidden || false,
        actions: route.actions || []
      },
      component: null,
      children: []
    }
    if (route.component) {
      const comModule = modules[`../${route.component}.vue`] || modules[`../${route.component}.tsx`]
      const component = route.component as string
      if (comModule || component.includes('#')) {
        // 动态加载路由文件
        data.component =
          component === '#' ? MainLayout : component.includes('##') ? BlankLayout : comModule
      } else {
        // dev
        console.error(`未找到${route.component}.vue文件或${route.component}.tsx文件，请创建`)
      }
    }
    // recursive child routes
    if (route.children) {
      data.children = generateRoutesByServer(route.children)
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
