import { http, HttpResponse } from 'msw'
import type { PrivilegeTreeNode } from 'src/models'

const treeNodes: PrivilegeTreeNode[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/users',
    name: 'system',
    icon: 'i-material-symbols:settings-outline-rounded',
    children: [
      {
        id: 2,
        path: 'groups',
        component: 'pages/system/groups/Index',
        name: 'groups',
        icon: 'i-material-symbols:account-tree-outline-rounded'
      },
      {
        id: 3,
        path: 'users',
        component: 'pages/system/users/Index',
        name: 'users',
        icon: 'i-material-symbols:person-outline-rounded'
      },
      {
        id: 4,
        path: 'roles',
        component: 'pages/system/roles/Index',
        name: 'roles',
        icon: 'i-material-symbols:shield-person-outline-rounded'
      },
      {
        id: 5,
        path: 'dictionaries',
        component: 'pages/system/dictionaries/Index',
        name: 'dictionaries',
        icon: 'i-material-symbols:book-3-outline-rounded'
      }
    ]
  },
  {
    id: 7,
    path: '/logs',
    component: '#',
    redirect: '/logs/operation',
    name: 'logs',
    icon: 'i-material-symbols:lab-profile-outline-rounded',
    children: [
      {
        id: 8,
        path: 'operation',
        component: 'pages/logs/operation/Index',
        name: 'operationLog',
        icon: 'i-material-symbols:clinical-notes-outline-rounded'
      },
      {
        id: 9,
        path: 'access',
        component: 'pages/logs/access/Index',
        name: 'accessLog',
        icon: 'i-material-symbols:sticky-note-2-outline-rounded'
      },
      {
        id: 10,
        path: 'audit',
        component: 'pages/logs/audit/Index',
        name: 'auditLog',
        icon: 'i-material-symbols:note-alt-outline-rounded'
      },
      {
        id: 11,
        path: 'scheduler',
        component: 'pages/logs/scheduler/Index',
        name: 'schedulerLog',
        icon: 'i-material-symbols:event-note-outline-rounded'
      }
    ]
  },
  {
    id: 12,
    path: '/regions',
    component: '#',
    name: 'regions',
    redirect: '/regions',
    icon: 'i-material-symbols:location-on-outline-rounded',
    children: [
      {
        id: 13,
        path: '',
        component: 'pages/regions/Index',
        name: 'regions',
        icon: 'i-material-symbols:location-on-outline-rounded',
        hidden: true
      }
    ]
  },
  {
    id: 14,
    path: '/files',
    component: '#',
    name: 'files',
    redirect: '/files',
    icon: 'i-material-symbols:folder-open-outline-rounded',
    children: [
      {
        id: 15,
        path: '',
        component: 'pages/files/Index',
        name: 'files',
        icon: 'i-material-symbols:folder-open-outline-rounded',
        hidden: true
      }
    ]
  },
  {
    id: 16,
    path: '/tools',
    component: '#',
    name: 'tools',
    redirect: '/tools/generator',
    icon: 'i-material-symbols:build-outline-rounded',
    children: [
      {
        id: 17,
        path: 'generator',
        component: 'pages/tools/generator/Index',
        name: 'generator',
        icon: 'i-material-symbols:code-rounded'
      },
      {
        id: 18,
        path: 'deploy',
        component: 'pages/tools/deploy/Index',
        name: 'deploy',
        icon: 'i-material-symbols:terminal-rounded'
      }
    ]
  }
]

export const privilegesHandlers = [
  http.get('/api/privileges/tree', () => {
    return HttpResponse.json(treeNodes)
  })
]
