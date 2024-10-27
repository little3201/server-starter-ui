import type { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'

export const constantRouterMap: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MainLayout,
    redirect: '/',
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/profile/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue')
  }
]
