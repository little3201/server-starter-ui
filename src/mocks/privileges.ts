import { http, HttpResponse } from 'msw'
import type { Privilege, PrivilegeTreeNode } from '~/models'


const datas: Privilege[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/users',
    name: 'system',
    order: 1,
    icon: 'i-mdi:cog-outline',
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
    order: 2,
    icon: 'i-mdi:clipboard-list-outline ',
    count: 3,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 12,
    path: '/regions',
    component: 'pages/regions/Index',
    name: 'regions',
    order: 3,
    icon: 'i-mdi:database-marker-outline',
    count: 0,
    enabled: true,
    description: 'this is description for this row'
  }
]

const subDatas: Privilege[] = [
  {
    id: 2,
    superiorId: 1,
    path: 'organizations',
    component: 'pages/system/organizations/Index',
    name: 'organizations',
    order: 1,
    count: 0,
    enabled: true,
    icon: 'i-mdi:account-multiple-plus-outline',
    description: 'this is description for this row'
  },
  {
    id: 3,
    superiorId: 1,
    path: 'users',
    component: 'pages/system/users/Index',
    name: 'users',
    order: 2,
    count: 0,
    enabled: true,
    icon: 'i-mdi:account-outline',
    description: 'this is description for this row'
  },
  {
    id: 4,
    superiorId: 1,
    path: 'privileges',
    component: 'pages/system/privileges/Index',
    name: 'privileges',
    order: 3,
    count: 0,
    enabled: true,
    icon: 'i-mdi:shield-key-outline',
    description: 'this is description for this row'
  },
  {
    id: 5,
    superiorId: 1,
    path: 'roles',
    component: 'pages/system/roles/Index',
    name: 'roles',
    order: 4,
    count: 0,
    enabled: true,
    icon: 'i-mdi:shield-account-outline',
    description: 'this is description for this row'
  },
  {
    id: 6,
    superiorId: 1,
    path: 'dictionaries',
    component: 'pages/system/dictionaries/Index',
    name: 'dictionaries',
    order: 5,
    count: 0,
    enabled: true,
    icon: 'i-mdi:book-outline',
    description: 'this is description for this row'
  },
  {
    id: 8,
    superiorId: 7,
    path: 'operation',
    component: 'pages/logs/operation/Index',
    name: 'operationLog',
    order: 1,
    count: 0,
    enabled: true,
    icon: 'i-mdi:clipboard-text-outline',
    description: 'this is description for this row'
  },
  {
    id: 9,
    superiorId: 7,
    path: 'access',
    component: 'pages/logs/access/Index',
    name: 'accessLog',
    order: 2,
    count: 0,
    enabled: true,
    icon: 'i-mdi:file-document-outline',
    description: 'this is description for this row'
  },
  {
    id: 10,
    superiorId: 7,
    path: 'audit',
    component: 'pages/logs/audit/Index',
    name: 'auditLog',
    order: 3,
    count: 0,
    enabled: true,
    icon: 'i-mdi:clipboard-check-outline',
    description: 'this is description for this row'
  },
  {
    id: 11,
    superiorId: 7,
    path: 'scheduler',
    component: 'pages/logs/scheduler/Index',
    name: 'schedulerLog',
    order: 4,
    count: 0,
    enabled: true,
    icon: 'i-mdi:calendar-text-outline',
    description: 'this is description for this row'
  }
]

const treeNodes: PrivilegeTreeNode[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/users',
    name: 'system',
    icon: 'i-mdi:cog-outline',
    children: [
      {
        id: 2,
        path: 'organizations',
        component: 'pages/system/organizations/Index',
        name: 'organizations',
        icon: 'i-mdi:account-multiple-plus-outline'
      },
      {
        id: 3,
        path: 'users',
        component: 'pages/system/users/Index',
        name: 'users',
        icon: 'i-mdi:account-outline'
      },
      {
        id: 4,
        path: 'privileges',
        component: 'pages/system/privileges/Index',
        name: 'privileges',
        icon: 'i-mdi:shield-key-outline'
      },
      {
        id: 5,
        path: 'roles',
        component: 'pages/system/roles/Index',
        name: 'roles',
        icon: 'i-mdi:shield-account-outline'
      },
      {
        id: 6,
        path: 'dictionaries',
        component: 'pages/system/dictionaries/Index',
        name: 'dictionaries',
        icon: 'i-mdi:book-outline'
      }
    ]
  },
  {
    id: 7,
    path: '/logs',
    component: '#',
    redirect: '/logs/operation',
    name: 'logs',
    icon: 'i-mdi:clipboard-list-outline',
    children: [
      {
        id: 8,
        path: 'operation',
        component: 'pages/logs/operation/Index',
        name: 'operationLog',
        icon: 'i-mdi:clipboard-text-outline'
      },
      {
        id: 9,
        path: 'access',
        component: 'pages/logs/access/Index',
        name: 'accessLog',
        icon: 'i-mdi:file-document-outline'
      },
      {
        id: 10,
        path: 'audit',
        component: 'pages/logs/audit/Index',
        name: 'auditLog',
        icon: 'i-mdi:clipboard-check-outline'
      },
      {
        id: 11,
        path: 'scheduler',
        component: 'pages/logs/scheduler/Index',
        name: 'schedulerLog',
        icon: 'i-mdi:calendar-text-outline'
      }
    ]
  },
  {
    id: 12,
    path: '/regions',
    component: '#',
    name: 'regions',
    redirect: '/regions',
    icon: 'i-mdi:database-marker-outline',
    children: [
      {
        id: 12,
        path: '',
        component: 'pages/regions/Index',
        name: 'regions-index',
        icon: 'i-mdi:database-marker-outline',
        hidden: true
      }
    ]
  }
]

export const privilegesHandlers = [
  http.get('/api/privileges/:username/tree', ({ params }) => {
    const { username } = params
    console.log("username: ", username)
    return HttpResponse.json(treeNodes)
  }),
  http.get('/api/privileges/:id/subset', ({ params }) => {
    const { id } = params
    return HttpResponse.json(subDatas.filter(item => item.superiorId === Number(id)))
  }),
  http.get('/api/privileges/:id', ({ params }) => {
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
    treeNodes.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Dictionary!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/privileges/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Dictionary by its ID.
    const deletedData = treeNodes.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Dictionary ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Dictionary from the "allDictionarys" map.
    treeNodes.pop()

    // Respond with a "200 OK" response and the deleted Dictionary.
    return HttpResponse.json(deletedData)
  })
]
