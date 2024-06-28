import Layout from 'components/layouts/Index.vue'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/',
    meta: {
      icon: 'i-ph:house',
    },
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('~/views/Index.vue'),
        meta: {
          hidden: true
        }
      },
    ]
  },
  {
    path: '/login',
    component: () => import('~/views/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('~/views/error/404.vue'),
    name: '404',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('~/views/error/403.vue'),
    name: '403',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('~/views/error/500.vue'),
    name: '500',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  // {
  //   path: '/:path(.*)*',
  //   redirect: '/404',
  //   name: 'NotFound',
  //   component: '',
  //   meta: {
  //     hidden: true
  //   }
  // }
]