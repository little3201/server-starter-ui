import MainLayout from '~/layouts/MainLayout.vue'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: MainLayout,
    redirect: '/',
    meta: {
      icon: 'i-ph:house',
    },
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('~/pages/Index.vue'),
        meta: {
          hidden: true
        }
      },
    ]
  },
  {
    path: '/login',
    component: () => import('~/pages/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/:cacheAll(.*)*',
    component: () => import('~/pages/ErrorNotFound.vue'),
    name: 'ErrorNotFound',
    meta: {
      hidden: true,
      title: 'ErrorNotFound',
      noTagsView: true
    }
  }
]