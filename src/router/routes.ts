// @unocss-include
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'

// 菜单图标预加载（unocss-icons使用后台数据加载图标，必须定义）
export const icons: string[] = [
  'icon-[material-symbols--settings-outline-rounded]',
  'icon-[material-symbols--lab-profile-outline-rounded]',
  'icon-[material-symbols--build-outline-rounded]',
  'icon-[material-symbols--folder-open-outline-rounded]',
  'icon-[material-symbols--location-on-outline-rounded]',
  'icon-[material-symbols--note-alt-outline-rounded]',
  'icon-[material-symbols--clinical-notes-outline-rounded]',
  'icon-[material-symbols--event-note-outline-rounded]',
  'icon-[material-symbols--shield-person-outline-rounded]',
  'icon-[material-symbols--sticky-note-2-outline-rounded]',
  'icon-[material-symbols--admin-panel-settings-outline-rounded]',
  'icon-[material-symbols--book-3-outline-rounded]',
  'icon-[material-symbols--person-outline-rounded]',
  'icon-[material-symbols--terminal-rounded]',
  'icon-[material-symbols--code-rounded]',
  'icon-[material-symbols--terminal-rounded]',
  'icon-[material-symbols--account-tree-outline-rounded]',
  'icon-[material-symbols--genetics-rounded]'
]

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
