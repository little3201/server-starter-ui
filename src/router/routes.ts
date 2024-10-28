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
        component: () => import('pages/profile/IndexPage.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue')
  }
]
