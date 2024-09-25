import { http, HttpResponse } from 'msw'
import type { Privilege, PrivilegeTreeNode } from 'src/models'

const datas: Privilege[] = [
  {
    id: 1,
    path: '/system',
    component: '#',
    redirect: '/system/users',
    name: 'system',
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 3,
    icon: 'i-material-symbols:folder-open-outline-rounded',
    count: 1,
    enabled: true,
    description: 'this is description for this row'
  },
  {
    id: 16,
    path: '/tools',
    component: '#',
    name: 'tools',
    redirect: '/tools',
    order: 3,
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 1,
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
    order: 1,
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
    component: 'pages/tools/generator/Index',
    order: 1,
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
    component: 'pages/tools/deploy/Index',
    order: 1,
    count: 0,
    enabled: true,
    icon: 'i-material-symbols:terminal-rounded',
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
        path: 'privileges',
        component: 'pages/system/privileges/Index',
        name: 'privileges',
        icon: 'i-material-symbols:admin-panel-settings-outline-rounded'
      },
      {
        id: 5,
        path: 'roles',
        component: 'pages/system/roles/Index',
        name: 'roles',
        icon: 'i-material-symbols:shield-person-outline-rounded'
      },
      {
        id: 6,
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
  http.get('/api/privileges/:username/tree', ({ params }) => {
    const { username } = params
    console.log('username: ', username)
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
    // Construct a JSON response with the list of all Row
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

    // Push the new Row to the map of all Dictionarys.
    treeNodes.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/privileges/:id', ({ params }) => {
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
