import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '~/layouts/MainLayout.vue'

export const constantRouterMap: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: MainLayout,
    redirect: '/',
    children: [
      {
        path: '',
        name: 'home-index',
        component: () => import('~/pages/Index.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/pages/Login.vue')
  }
]