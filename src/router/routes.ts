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
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('pages/others/AboutPage.vue')
      },
      {
        path: '/privacy-policy',
        name: 'privacyPolicy',
        component: () => import('pages/others/PrivacyPolicy.vue')
      },
      {
        path: '/license',
        name: 'license',
        component: () => import('pages/others/LicensePage.vue')
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('pages/others/HelpPage.vue')
      }
    ]
  },
  {
    path: '/callback',
    name: 'callback',
    component: () => import('pages/CallbackPage.vue')
  }
]
