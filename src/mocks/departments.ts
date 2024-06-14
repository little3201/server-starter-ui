import { http, HttpResponse } from 'msw'
import type { Department, TreeNode } from '~/api/models.type'

const datas: Department[] = []
const subDatas: Department[] = []

for (let i = 1; i < 200; i++) {
  const data: Department = {
    id: i,
    name: 'department_' + i,
    enabled: i % 3 > 0,
    description: '这是描述',
    hasChildren: i % 3 > 0
  }
  for (let j = 0; j < i; j++) {
    const subData: Department = {
      id: 100 + j,
      name: 'department_' + i + '_' + j,
      superiorId: i,
      enabled: j % 2 > 0,
      description: 'description',
      hasChildren: false
    }
    subDatas.push(subData)
  }
  datas.push(data)
}

const treeNodes: TreeNode[] = [
  {
    id: 1,
    name: 'department_1',
    enabled: true,
    description: 'description',
    children: [
      {
        id: 2,
        name: 'department_2',
        enabled: true,
        description: 'description',
        children: [
        ]
      },
      {
        id: 3,
        name: 'department_3',
        enabled: true,
        description: 'description',
        children: [
          {
            id: 4,
            name: 'department_4',
            enabled: true,
            description: 'description',
            children: [
            ]
          }
        ]
      }
    ]
  }
]

export const departmentsHandlers = [
  http.get('/api/departments/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/departments/tree', () => {
    return HttpResponse.json(treeNodes)
  }),
  http.get('/api/departments/:id/subset', ({ params }) => {
    const superiorId = params.id
    return HttpResponse.json(subDatas.filter(item => item.superiorId === Number(superiorId)))
  }),
  http.get('/api/departments', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Department
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/departments', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Department

    // Push the new Department to the map of all Department.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Department!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/departments/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Department by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Department ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Department from the "allDictionarys" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Department.
    return HttpResponse.json(deletedData)
  })
]
