// @unocss-include
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'

// 菜单图标预加载（unocss-icons使用后台数据加载图标，必须定义）
export const icons: string[] = [
  'i-material-symbols:settings-outline-rounded',
  'i-material-symbols:lab-profile-outline-rounded',
  'i-material-symbols:build-outline-rounded',
  'i-material-symbols:folder-open-outline-rounded',
  'i-material-symbols:location-on-outline-rounded',
  'i-material-symbols:note-alt-outline-rounded',
  'i-material-symbols:clinical-notes-outline-rounded',
  'i-material-symbols:event-note-outline-rounded',
  'i-material-symbols:shield-person-outline-rounded',
  'i-material-symbols:sticky-note-2-outline-rounded',
  'i-material-symbols:admin-panel-settings-outline-rounded',
  'i-material-symbols:book-3-outline-rounded',
  'i-material-symbols:person-outline-rounded',
  'i-material-symbols:terminal-rounded',
  'i-material-symbols:code-rounded',
  'i-material-symbols:terminal-rounded',
  'i-material-symbols:account-tree-outline-rounded',
  'i-material-symbols:genetics-rounded'
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
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue')
  }
]
