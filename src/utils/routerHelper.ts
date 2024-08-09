import type {
  RouteLocationNormalized,
  RouteRecordNormalized
} from 'vue-router'
import { isUrl } from '~/utils'

const MainLayout = () => import('~/layouts/MainLayout.vue')
const BlankLayout = () => import('~/layouts/BlankLayout.vue')

const modules = import.meta.glob('../pages/**/*.{vue,tsx}')

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
        meta: item.meta,
        name: item.name,
        path: item.path
      }))
      : undefined) as RouteRecordNormalized[]
  }
}

// 路由生成
export const generateRoutesByServer = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []

  for (const route of routes) {
    const data: AppRouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: {
        icon: route.icon,
        hidden: route.hidden || false,
        actions: route.actions || []
      }
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
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}
