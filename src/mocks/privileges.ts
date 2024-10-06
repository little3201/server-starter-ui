import { http, HttpResponse } from 'msw'
import type { PrivilegeTreeNode } from 'src/models'

const treeNodes: PrivilegeTreeNode[] = [
  {
    id: 1,
    name: 'system',
    meta: {
      path: '/system',
      component: '#',
      redirect: '/system/users',
      icon: 'i-material-symbols:settings-outline-rounded',
    },
    children: [
      {
        id: 2,
        name: 'groups',
        meta: {
          path: 'groups',
          component: 'pages/system/groups/Index',
          icon: 'i-material-symbols:account-tree-outline-rounded'
        }
      },
      {
        id: 3,
        name: 'users',
        meta: {
          path: 'users',
          component: 'pages/system/users/Index',
          icon: 'i-material-symbols:person-outline-rounded'
        }
      },
      {
        id: 4,
        name: 'roles',
        meta: {
          path: 'roles',
          component: 'pages/system/roles/Index',
          icon: 'i-material-symbols:shield-person-outline-rounded'
        }
      },
      {
        id: 5,
        name: 'dictionaries',
        meta: {
          path: 'dictionaries',
          component: 'pages/system/dictionaries/Index',
          icon: 'i-material-symbols:book-3-outline-rounded'
        }
      }
    ]
  },
  {
    id: 7,
    name: 'logs',
    meta: {
      path: '/logs',
      component: '#',
      redirect: '/logs/operation',
      icon: 'i-material-symbols:lab-profile-outline-rounded',
    },
    children: [
      {
        id: 8,
        name: 'operationLog',
        meta: {
          path: 'operation',
          component: 'pages/logs/operation/Index',
          icon: 'i-material-symbols:clinical-notes-outline-rounded'
        }
      },
      {
        id: 9,
        name: 'accessLog',
        meta: {
          path: 'access',
          component: 'pages/logs/access/Index',
          icon: 'i-material-symbols:sticky-note-2-outline-rounded'
        }
      },
      {
        id: 10,
        name: 'auditLog',
        meta: {
          path: 'audit',
          component: 'pages/logs/audit/Index',
          icon: 'i-material-symbols:note-alt-outline-rounded'
        }
      },
      {
        id: 11,
        name: 'schedulerLog',
        meta: {
          path: 'scheduler',
          component: 'pages/logs/scheduler/Index',
          icon: 'i-material-symbols:event-note-outline-rounded'
        }
      }
    ]
  },
  {
    id: 12,
    name: 'regions',
    meta: {
      path: '/regions',
      component: '#',
      redirect: '/regions',
      icon: 'i-material-symbols:location-on-outline-rounded',
    },
    children: [
      {
        id: 13,
        name: 'regions',
        meta: {
          path: '',
          component: 'pages/regions/Index',
          icon: 'i-material-symbols:location-on-outline-rounded',
          hidden: true
        }
      }
    ]
  },
  {
    id: 14,
    name: 'files',
    meta: {
      path: '/files',
      component: '#',
      redirect: '/files',
      icon: 'i-material-symbols:folder-open-outline-rounded',
    },
    children: [
      {
        id: 15,
        name: 'files',
        meta: {
          path: '',
          component: 'pages/files/Index',
          icon: 'i-material-symbols:folder-open-outline-rounded',
          hidden: true
        }
      }
    ]
  },
  {
    id: 16,
    name: 'tools',
    meta: {
      path: '/tools',
      component: '#',
      redirect: '/tools/generator',
      icon: 'i-material-symbols:build-outline-rounded',
    },
    children: [
      {
        id: 17,
        name: 'generator',
        meta: {
          path: 'generator',
          component: 'pages/tools/generator/Index',
          icon: 'i-material-symbols:code-rounded'
        }
      },
      {
        id: 18,
        name: 'deploy',
        meta: {
          path: 'deploy',
          component: 'pages/tools/deploy/Index',
          icon: 'i-material-symbols:terminal-rounded'
        }
      }
    ]
  }
]

export const privilegesHandlers = [
  http.get('/api/privileges', () => {
    return HttpResponse.json(treeNodes)
  })
]
