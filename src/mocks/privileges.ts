import { http, HttpResponse } from 'msw'
import type { Privilege, PrivilegeTreeNode } from '~/models'


const datas: PrivilegeTreeNode[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/user',
    name: 'system',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
    description: 'this is description for this row',
    children: [
      {
        id: 2,
        path: 'organizations',
        component: 'views/system/organizations/Index',
        name: 'organizations',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:tree-structure'
        },
        description: 'this is description for this row'
      },
      {
        id: 3,
        path: 'users',
        component: 'views/system/users/Index',
        name: 'users',
        order: 2,
        enabled: true,
        meta: {
          icon: 'i-ph:user'
        },
        description: 'this is description for this row'
      },
      {
        id: 4,
        path: 'privileges',
        component: 'views/system/privileges/Index',
        name: 'privileges',
        order: 3,
        enabled: true,
        meta: {
          icon: 'i-ph:lock-key'
        },
        description: 'this is description for this row'
      },
      {
        id: 5,
        path: 'roles',
        component: 'views/system/roles/Index',
        name: 'roles',
        order: 4,
        enabled: true,
        meta: {
          icon: 'i-ph:user-circle'
        },
        description: 'this is description for this row'
      },
      {
        id: 6,
        path: 'dictionaries',
        component: 'views/system/dictionaries/Index',
        name: 'dictionaries',
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
    name: 'logs',
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
        name: 'actionLog',
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
        name: 'accessLog',
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
        name: 'auditLog',
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
        name: 'schedulerLog',
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
    redirect: '/system/users',
    name: 'system',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
    description: 'this is description for this row'
  },
  {
    id: 2,
    path: 'organizations',
    component: 'views/system/organizations/Index',
    name: 'organizations',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:tree-structure'
    },
    description: 'this is description for this row'
  },
  {
    id: 3,
    path: 'users',
    component: 'views/system/users/Index',
    name: 'users',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:user'
    },
    description: 'this is description for this row'
  },
  {
    id: 4,
    path: 'privileges',
    component: 'views/system/privileges/Index',
    name: 'privileges',
    order: 3,
    enabled: true,
    meta: {
      icon: 'i-ph:lock-key'
    },
    description: 'this is description for this row'
  },
  {
    id: 5,
    path: 'roles',
    component: 'views/system/roles/Index',
    name: 'roles',
    order: 4,
    enabled: true,
    meta: {
      icon: 'i-ph:user-circle'
    },
    description: 'this is description for this row'
  },
  {
    id: 6,
    path: 'dictionaries',
    component: 'views/system/dictionaries/Index',
    name: 'dictionaries',
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
    name: 'logs',
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
    name: 'actionLog',
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
    name: 'accesslog',
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
    name: 'auditlog',
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
    name: 'schedulerlog',
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
    // Construct a JSON response with the list of all privilege
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
