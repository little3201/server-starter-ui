import { http, HttpResponse } from 'msw'
import type { Privilege, PrivilegeTreeNode } from '~/models'


const datas: PrivilegeTreeNode[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/user',
    name: 'System',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
    description: 'this is description for this row',
    children: [
      {
        id: 2,
        path: 'organization',
        component: 'views/system/organization/Index',
        name: 'Organization',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:tree-structure'
        },
        description: 'this is description for this row'
      },
      {
        id: 3,
        path: 'user',
        component: 'views/system/user/Index',
        name: 'User',
        order: 2,
        enabled: true,
        meta: {
          icon: 'i-ph:user'
        },
        description: 'this is description for this row'
      },
      {
        id: 4,
        path: 'privilege',
        component: 'views/system/privilege/Index',
        name: 'Privilege',
        order: 3,
        enabled: true,
        meta: {
          icon: 'i-ph:lock-key'
        },
        description: 'this is description for this row'
      },
      {
        id: 5,
        path: 'role',
        component: 'views/system/role/Index',
        name: 'Role',
        order: 4,
        enabled: true,
        meta: {
          icon: 'i-ph:user-circle'
        },
        description: 'this is description for this row'
      },
      {
        id: 6,
        path: 'dictionary',
        component: 'views/system/dictionary/Index',
        name: 'Dictionary',
        order: 5,
        enabled: true,
        meta: {
          icon: 'i-ph:book'
        },
        description: 'this is description for this row'
      }
    ]
  },
  {
    id: 7,
    path: '/logs',
    component: '#',
    redirect: '/logs/action',
    name: 'Log',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:files'
    },
    description: 'this is description for this row',
    children: [
      {
        id: 8,
        path: 'action',
        component: 'views/logs/action/Index',
        name: 'ActionLog',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:clipboard-text'
        },
        description: 'this is description for this row'
      },
      {
        id: 9,
        path: 'access',
        component: 'views/logs/access/Index',
        name: 'AccessLog',
        order: 2,
        enabled: true,
        meta: {
          icon: 'i-ph:file-text'
        },
        description: 'this is description for this row'
      },
      {
        id: 10,
        path: 'audit',
        component: 'views/logs/audit/Index',
        name: 'AuditLog',
        order: 3,
        enabled: true,
        meta: {
          icon: 'i-ph:file-lock'
        },
        description: 'this is description for this row'
      },
      {
        id: 11,
        path: 'scheduler',
        component: 'views/logs/scheduler/Index',
        name: 'SchedulerLog',
        order: 4,
        enabled: true,
        meta: {
          icon: 'i-ph:file-cloud'
        },
        description: 'this is description for this row'
      }
    ]
  }
]

const dataArray: Privilege[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/user',
    name: 'System',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
    description: 'this is description for this row'
  },
  {
    id: 2,
    path: 'organization',
    component: 'views/system/organization/Index',
    name: 'Organization',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:tree-structure'
    },
    description: 'this is description for this row'
  },
  {
    id: 3,
    path: 'user',
    component: 'views/system/user/Index',
    name: 'User',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:user'
    },
    description: 'this is description for this row'
  },
  {
    id: 4,
    path: 'privilege',
    component: 'views/system/privilege/Index',
    name: 'Privilege',
    order: 3,
    enabled: true,
    meta: {
      icon: 'i-ph:lock-key'
    },
    description: 'this is description for this row'
  },
  {
    id: 5,
    path: 'role',
    component: 'views/system/role/Index',
    name: 'Role',
    order: 4,
    enabled: true,
    meta: {
      icon: 'i-ph:user-circle'
    },
    description: 'this is description for this row'
  },
  {
    id: 6,
    path: 'dictionary',
    component: 'views/system/dictionary/Index',
    name: 'Dictionary',
    order: 5,
    enabled: true,
    meta: {
      icon: 'i-ph:book'
    },
    description: 'this is description for this row'
  },
  {
    id: 7,
    path: '/logs',
    component: '#',
    redirect: '/log/action',
    name: 'Log',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:files'
    },
    description: 'this is description for this row'
  },
  {
    id: 8,
    path: 'action',
    component: 'views/logs/action/Index',
    name: 'ActionLog',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:clipboard-text'
    },
    description: 'this is description for this row'
  },
  {
    id: 9,
    path: 'access',
    component: 'views/logs/access/Index',
    name: 'AccessLog',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:file-text'
    },
    description: 'this is description for this row'
  },
  {
    id: 10,
    path: 'audit',
    component: 'views/logs/audit/Index',
    name: 'AuditLog',
    order: 3,
    enabled: true,
    meta: {
      icon: 'i-ph:file-lock'
    },
    description: 'this is description for this row'
  },
  {
    id: 11,
    path: 'scheduler',
    component: 'views/logs/scheduler/Index',
    name: 'SchedulerLog',
    order: 4,
    enabled: true,
    meta: {
      icon: 'i-ph:file-cloud'
    },
    description: 'this is description for this row'
  }
]

export const privilegesHandlers = [
  http.get('/api/privileges/:id', ({ params }) => {
    const { id } = params
    if (id) {
      let res = dataArray.filter(item => item.id === Number(id))[0]
      if (res) {
        return HttpResponse.json(res)
      }
      return HttpResponse.json(datas)
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/privileges', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Privilege
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/privileges', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as PrivilegeTreeNode

    // Push the new Dictionary to the map of all Dictionarys.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Dictionary!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/privileges/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Dictionary by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Dictionary ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Dictionary from the "allDictionarys" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Dictionary.
    return HttpResponse.json(deletedData)
  })
]
