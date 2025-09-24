import type { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'


export const constantRouterMap: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/profile/IndexPage.vue'),
        children: [
          {
            path: '',
            name: 'overview',
            component: () => import('pages/profile/OverviewPage.vue')
          },
          {
            path: 'activities',
            name: 'activities',
            component: () => import('pages/profile/ActivityPage.vue')
          },
          {
            path: 'notifications',
            name: 'notifications',
            component: () => import('pages/profile/NotificationPage.vue')
          },
          {
            path: 'change-password',
            name: 'ChangePassword',
            component: () => import('pages/profile/ChangePassword.vue')
          },
          {
            path: 'sessions',
            name: 'sessions',
            component: () => import('pages/profile/SessionPage.vue')
          }
        ]
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import('pages/faq/IndexPage.vue')
      }
    ]
  }
]
