import { http, HttpResponse } from 'msw'
import type { Privilege, PrivilegeTreeNode } from '~/api/models.type'


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
        }
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
        }
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
        }
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
        }
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
        }
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
    children: [
      {
        id: 8,
        path: 'action',
        component: 'views/log/action/Index',
        name: 'ActionLog',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:clipboard-text'
        }
      },
      {
        id: 9,
        path: 'access',
        component: 'views/log/access/Index',
        name: 'AccessLog',
        order: 2,
        enabled: true,
        meta: {
          icon: 'i-ph:file-text'
        }
      },
      {
        id: 10,
        path: 'audit',
        component: 'views/log/audit/Index',
        name: 'AuditLog',
        order: 3,
        enabled: true,
        meta: {
          icon: 'i-ph:file-lock'
        }
      },
      {
        id: 11,
        path: 'scheduler',
        component: 'views/log/scheduler/Index',
        name: 'SchedulerLog',
        order: 4,
        enabled: true,
        meta: {
          icon: 'i-ph:file-cloud'
        }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
  http.get('/api/privileges/:id/subset', ({ params }) => {
    const superiorId = params.id
    return HttpResponse.json(datas.filter(item => item.superiorId === Number(superiorId)))
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
