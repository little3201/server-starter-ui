import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/constants'
import type { Privilege, PrivilegeTreeNode, RolePrivileges, GroupPrivileges, UserPrivileges } from 'src/types'

const datas: Privilege[] = [
  {
    id: 1,
    path: 'system',
    component: '#',
    redirect: 'users',
    name: 'system',
    icon: 'settings-outline',
    count: 5,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 7,
    path: 'logs',
    component: '#',
    redirect: 'operation',
    name: 'logs',
    icon: 'lab-profile-outline',
    count: 3,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 12,
    path: 'regions',
    component: 'regions',
    name: 'regions',
    icon: 'location-on-outline',
    actions: ['create', 'modify', 'remove', 'import', 'export'],
    count: 0,
    enabled: false,
    description: 'this is description for this row'
  },
  {
    id: 13,
    path: 'files',
    component: 'files',
    name: 'files',
    icon: 'folder-open-outline',
    actions: ['upload', 'download', 'remove'],
    count: 0,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 14,
    path: 'exploiters',
    component: '#',
    name: 'exploiters',
    redirect: 'generators',
    icon: 'build-outline',
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
    component: 'system/groups',
    name: 'groups',
    actions: ['create', 'modify', 'remove', 'import', 'export', 'relation'],
    count: 0,
    enabled: true,
    icon: 'account-tree-outline',
    description: 'this is description for this row'
  },
  {
    id: 3,
    superiorId: 1,
    path: 'users',
    component: 'system/users',
    name: 'users',
    actions: ['create', 'modify', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'person-outline',
    description: 'this is description for this row'
  },
  {
    id: 4,
    superiorId: 1,
    path: 'privileges',
    component: 'system/privileges',
    name: 'privileges',
    actions: ['modify', 'authorize', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'admin-panel-settings-outline',
    description: 'this is description for this row'
  },
  {
    id: 5,
    superiorId: 1,
    path: 'roles',
    component: 'system/roles',
    name: 'roles',
    actions: ['create', 'modify', 'remove', 'import', 'export', 'relation'],
    count: 0,
    enabled: true,
    icon: 'shield-person-outline',
    description: 'this is description for this row'
  },
  {
    id: 6,
    superiorId: 1,
    path: 'dictionaries',
    component: 'system/dictionaries',
    name: 'dictionaries',
    actions: ['create', 'modify', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'book-3-outline',
    description: 'this is description for this row'
  },
  {
    id: 8,
    superiorId: 7,
    path: 'operation',
    component: 'logs/operation',
    name: 'operationLog',
    actions: ['clear', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'clinical-notes-outline',
    description: 'this is description for this row'
  },
  {
    id: 9,
    superiorId: 7,
    path: 'access',
    component: 'logs/access',
    name: 'accessLog',
    actions: ['clear', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'sticky-note-2-outline',
    description: 'this is description for this row'
  },
  {
    id: 10,
    superiorId: 7,
    path: 'audit',
    component: 'logs/audit',
    name: 'auditLog',
    actions: ['export'],
    count: 0,
    enabled: true,
    icon: 'note-alt-outline',
    description: 'this is description for this row'
  },
  {
    id: 11,
    superiorId: 7,
    path: 'scheduler',
    component: 'logs/scheduler',
    name: 'schedulerLog',
    actions: ['clear', 'export', 'remove'],
    count: 0,
    enabled: true,
    icon: 'event-note-outline',
    description: 'this is description for this row'
  },
  {
    id: 15,
    superiorId: 14,
    path: 'generators',
    name: 'generators',
    component: 'exploiters/generators',
    actions: ['create', 'modify', 'remove', 'import', 'export', 'config', 'preview'],
    count: 0,
    enabled: true,
    icon: 'genetics',
    description: 'this is description for this row'
  },
  {
    id: 16,
    superiorId: 14,
    path: 'scripts',
    name: 'scripts',
    component: 'exploiters/scripts',
    actions: ['create', 'modify', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'terminal',
    description: 'this is description for this row'
  },
  {
    id: 17,
    superiorId: 14,
    path: 'templates',
    name: 'templates',
    component: 'exploiters/templates',
    actions: ['create', 'modify', 'remove', 'import', 'export'],
    count: 0,
    enabled: true,
    icon: 'code',
    description: 'this is description for this row'
  }
]

const treeNodes: PrivilegeTreeNode[] = [
  {
    id: 1,
    name: 'system',
    meta: {
      path: 'system',
      component: '#',
      redirect: 'users',
      icon: 'settings-outline'
    },
    children: [
      {
        id: 2,
        name: 'groups',
        meta: {
          path: 'groups',
          component: 'system/groups',
          icon: 'account-tree-outline',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      },
      {
        id: 3,
        name: 'users',
        meta: {
          path: 'users',
          component: 'system/users',
          icon: 'person-outline',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      },
      {
        id: 4,
        name: 'roles',
        meta: {
          path: 'roles',
          component: 'system/roles',
          icon: 'shield-person-outline',
          actions: ['create', 'modify', 'remove', 'import', 'export', 'relation']
        }
      },
      {
        id: 5,
        name: 'dictionaries',
        meta: {
          path: 'dictionaries',
          component: 'system/dictionaries',
          icon: 'book-3-outline',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      },
      {
        id: 6,
        name: 'privileges',
        meta: {
          path: 'privileges',
          component: 'system/privileges',
          icon: 'admin-panel-settings-outline',
          actions: ['modify', 'authorize', 'import', 'export']
        }
      }
    ]
  },
  {
    id: 7,
    name: 'logs',
    meta: {
      path: 'logs',
      component: '#',
      redirect: 'operation',
      icon: 'lab-profile-outline'
    },
    children: [
      {
        id: 8,
        name: 'operationLog',
        meta: {
          path: 'operation',
          component: 'logs/operation',
          icon: 'clinical-notes-outline'
        }
      },
      {
        id: 9,
        name: 'accessLog',
        meta: {
          path: 'access',
          component: 'logs/access',
          icon: 'sticky-note-2-outline'
        }
      },
      {
        id: 10,
        name: 'auditLog',
        meta: {
          path: 'audit',
          component: 'logs/audit',
          icon: 'note-alt-outline'
        }
      },
      {
        id: 11,
        name: 'schedulerLog',
        meta: {
          path: 'scheduler',
          component: 'logs/scheduler',
          icon: 'event-note-outline'
        }
      }
    ]
  },
  {
    id: 12,
    name: 'regions',
    meta: {
      path: 'regions',
      component: 'regions',
      icon: 'location-on-outline',
      actions: ['create', 'modify', 'remove', 'import', 'export']
    }
  },
  {
    id: 13,
    name: 'files',
    meta: {
      path: 'files',
      component: 'files',
      icon: 'folder-open-outline',
      actions: ['download', 'upload', 'remove']
    }
  },
  {
    id: 14,
    name: 'exploiters',
    meta: {
      path: 'exploiters',
      component: '#',
      redirect: 'generators',
      icon: 'build-outline'
    },
    children: [
      {
        id: 15,
        name: 'generators',
        meta: {
          path: 'generators',
          component: 'exploiters/generators',
          icon: 'code',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      },
      {
        id: 16,
        name: 'scripts',
        meta: {
          path: 'scripts',
          component: 'exploiters/scripts',
          icon: 'terminal',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      },
      {
        id: 17,
        name: 'templates',
        meta: {
          path: 'templates',
          component: 'exploiters/templates',
          icon: 'terminal',
          actions: ['create', 'modify', 'remove', 'import', 'export']
        }
      }
    ]
  }
]


const roles: RolePrivileges[] = []

for (let i = 1; i < 28; i++) {
  const row: RolePrivileges = {
    id: i,
    privilegeId: i < 15 ? i : i - 14,
    roleId: i
  }
  roles.push(row)
}


const groups: GroupPrivileges[] = []

for (let i = 1; i < 28; i++) {
  const row: GroupPrivileges = {
    id: i,
    privilegeId: i < 15 ? i : i - 14,
    groupId: i
  }
  groups.push(row)
}


const users: UserPrivileges[] = []

for (let i = 1; i < 28; i++) {
  const row: UserPrivileges = {
    id: i,
    privilegeId: i < 15 ? i : i - 14,
    username: 'username' + i
  }
  users.push(row)
}

export const privilegesHandlers = [
  http.get(`/api${SERVER_URL.PRIVILEGE}/:id/roles`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(roles.filter(item => item.privilegeId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
  http.get(`/api${SERVER_URL.PRIVILEGE}/:id/groups`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(groups.filter(item => item.privilegeId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
  http.get(`/api${SERVER_URL.PRIVILEGE}/:id/users`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(users.filter(item => item.privilegeId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
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
