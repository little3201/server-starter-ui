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
        path: 'department',
        component: 'views/system/department/Index',
        name: 'Department',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:users'
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
          icon: 'i-ph:list-dashes'
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
          icon: 'i-ph:user-list'
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
    path: '/log',
    component: '#',
    redirect: '/log/action',
    name: 'Log',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
    children: [
      {
        id: 8,
        path: 'action',
        component: 'views/log/action/Index',
        name: 'Action',
        order: 1,
        enabled: true,
        meta: {
          icon: 'i-ph:users'
        }
      },
      {
        id: 9,
        path: 'visit',
        component: 'views/log/visit/Index',
        name: 'Visit',
        order: 2,
        enabled: true,
        meta: {
          icon: 'i-ph:user'
        }
      },
      {
        id: 10,
        path: 'audit',
        component: 'views/log/audit/Index',
        name: 'Audit',
        order: 3,
        enabled: true,
        meta: {
          icon: 'i-ph:list-dashes'
        }
      }
    ]
  }
]
const dataArray: Privilege[] = [
  {
    id: 1,
    category: 'D',
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
    category: 'M',
    path: 'department',
    component: 'views/system/department/Index',
    name: 'Department',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:users'
    }
  },
  {
    id: 3,
    category: 'M',
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
    category: 'M',
    path: 'privilege',
    component: 'views/system/privilege/Index',
    name: 'Privilege',
    order: 3,
    enabled: true,
    meta: {
      icon: 'i-ph:list-dashes'
    }
  },
  {
    id: 5,
    category: 'M',
    path: 'role',
    component: 'views/system/role/Index',
    name: 'Role',
    order: 4,
    enabled: true,
    meta: {
      icon: 'i-ph:user-list'
    }
  },
  {
    id: 6,
    category: 'M',
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
    category: 'D',
    path: '/log',
    component: '#',
    redirect: '/log/action',
    name: 'Log',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:gear'
    },
  },
  {
    id: 8,
    category: 'M',
    path: 'action',
    component: 'views/log/action/Index',
    name: 'Action',
    order: 1,
    enabled: true,
    meta: {
      icon: 'i-ph:users'
    }
  },
  {
    id: 9,
    category: 'M',
    path: 'visit',
    component: 'views/log/visit/Index',
    name: 'Visit',
    order: 2,
    enabled: true,
    meta: {
      icon: 'i-ph:user'
    }
  },
  {
    id: 10,
    category: 'M',
    path: 'audit',
    component: 'views/log/audit/Index',
    name: 'Audit',
    order: 3,
    enabled: true,
    meta: {
      icon: 'i-ph:list-dashes'
    }
  }
]

export const privilegesHandlers = [
  http.get('/api/privileges/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(dataArray.filter(item => item.id === Number(id))[0])
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
