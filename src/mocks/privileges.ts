import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/api/paths'
import type { Privilege, PrivilegeTreeNode } from 'src/models'


const datas: Privilege[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/users',
    name: 'system',
    icon: 'i-material-symbols:settings-outline-rounded',
    count: 5,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 7,
    path: '/logs',
    component: '#',
    redirect: '/logs/operation',
    name: 'logs',
    icon: 'i-material-symbols:lab-profile-outline-rounded ',
    count: 3,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 12,
    path: '/regions',
    component: '#',
    name: 'regions',
    redirect: '/regions',
    icon: 'i-material-symbols:location-on-outline-rounded',
    count: 1,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 14,
    path: '/files',
    component: '#',
    name: 'files',
    redirect: '/files',
    icon: 'i-material-symbols:folder-open-outline-rounded',
    count: 1,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 16,
    path: '/exploiter',
    component: '#',
    name: 'exploiter',
    redirect: '/exploiter',
    icon: 'i-material-symbols:build-outline-rounded',
    count: 1,
    enabled: true,
    description: 'this is description for this row'
  }
]

const subDatas: Privilege[] = [
  {
    id: 2,
    superiorId: 1,
    path: 'groups',
    component: 'pages/system/groups/Index',
    name: 'groups',
    actions: ['add', 'edit', 'remove', 'import', 'export', 'relation'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:account-tree-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 3,
    superiorId: 1,
    path: 'users',
    component: 'pages/system/users/Index',
    name: 'users',
    actions: ['add', 'edit', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:person-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 4,
    superiorId: 1,
    path: 'privileges',
    component: 'pages/system/privileges/Index',
    name: 'privileges',
    actions: ['edit', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:admin-panel-settings-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 5,
    superiorId: 1,
    path: 'roles',
    component: 'pages/system/roles/Index',
    name: 'roles',
    actions: ['add', 'edit', 'remove', 'import', 'export', 'relation'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:shield-person-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 6,
    superiorId: 1,
    path: 'dictionaries',
    component: 'pages/system/dictionaries/Index',
    name: 'dictionaries',
    actions: ['add', 'edit', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:book-3-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 8,
    superiorId: 7,
    path: 'operation',
    component: 'pages/logs/operation/Index',
    name: 'operationLog',
    actions: ['clear', 'detail', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:clinical-notes-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 9,
    superiorId: 7,
    path: 'access',
    component: 'pages/logs/access/Index',
    name: 'accessLog',
    actions: ['clear', 'detail', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:sticky-note-2-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 10,
    superiorId: 7,
    path: 'audit',
    component: 'pages/logs/audit/Index',
    name: 'auditLog',
    actions: ['detail', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:note-alt-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 11,
    superiorId: 7,
    path: 'scheduler',
    component: 'pages/logs/scheduler/Index',
    name: 'schedulerLog',
    actions: ['clear', 'detail', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:event-note-outline-rounded',
    description: 'this is description for this row'
  },
  {
    id: 13,
    superiorId: 12,
    path: '',
    name: 'regions',
    component: 'pages/regions/Index',
    actions: ['add', 'edit', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:location-on-outline-rounded',
    hidden: true,
    description: 'this is description for this row'
  },
  {
    id: 15,
    superiorId: 14,
    path: '',
    name: 'files',
    component: 'pages/files/Index',
    actions: ['upload', 'download', 'remove'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:folder-open-outline-rounded',
    hidden: true,
    description: 'this is description for this row'
  },
  {
    id: 17,
    superiorId: 16,
    path: 'generator',
    name: 'generator',
    component: 'pages/exploiter/generator/Index',
    actions: ['add', 'edit', 'remove', 'import', 'export', 'config', 'preview'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:code-rounded',
    description: 'this is description for this row'
  },
  {
    id: 18,
    superiorId: 16,
    path: 'deploy',
    name: 'deploy',
    component: 'pages/exploiter/deploy/Index',
    actions: ['add', 'edit', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:terminal-rounded',
    description: 'this is description for this row'
  }
]

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
      },
      {
        id: 6,
        name: 'privileges',
        meta: {
          path: 'privileges',
          component: 'pages/system/privileges/Index',
          icon: 'i-material-symbols:admin-panel-settings-outline-rounded'
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
    name: 'exploiter',
    meta: {
      path: '/exploiter',
      component: '#',
      redirect: '/exploiter/generator',
      icon: 'i-material-symbols:build-outline-rounded',
    },
    children: [
      {
        id: 17,
        name: 'generator',
        meta: {
          path: 'generator',
          component: 'pages/exploiter/generator/Index',
          icon: 'i-material-symbols:code-rounded'
        }
      },
      {
        id: 18,
        name: 'deploy',
        meta: {
          path: 'deploy',
          component: 'pages/exploiter/deploy/Index',
          icon: 'i-material-symbols:terminal-rounded'
        }
      }
    ]
  }
]

export const privilegesHandlers = [
  http.get(`/api${SERVER_URL.PRIVILEGE}/tree`, () => {
    return HttpResponse.json(treeNodes)
  }),
  http.get(`/api${SERVER_URL.PRIVILEGE}/:id/subset`, ({ params }) => {
    const { id } = params
    return HttpResponse.json(subDatas.filter(item => item.superiorId === Number(id)))
  }),
  http.get(`/api${SERVER_URL.PRIVILEGE}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      let res = datas.filter(item => item.id === Number(id))[0]
      if (!res) {
        res = subDatas.filter(item => item.id === Number(id))[0]
      }
      return HttpResponse.json(res)
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.PRIVILEGE}`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      page: {
        totalElements: datas.length
      }
    }

    return HttpResponse.json(data)
  }),
  http.post(`/api${SERVER_URL.PRIVILEGE}`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as PrivilegeTreeNode

    // Push the new Row to the map of all Dictionarys.
    treeNodes.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete(`/api${SERVER_URL.PRIVILEGE}/:id`, ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Row by its ID.
    const deletedData = treeNodes.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Row ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Row from the "allRow" map.
    treeNodes.pop()

    // Respond with a "200 OK" response and the deleted Row.
    return HttpResponse.json(deletedData)
  })
]
