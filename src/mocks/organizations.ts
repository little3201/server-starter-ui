import { http, HttpResponse } from 'msw'
import type { Organization, TreeNode } from '~/models'

const datas: Organization[] = []
const subDatas: Organization[] = []

for (let i = 1; i < 28; i++) {
  const data: Organization = {
    id: i,
    name: 'organization_' + i,
    enabled: i % 3 > 0,
    description: '这是描述内容，请参考嘻嘻嘻嘻嘻嘻嘻嘻',
    hasChildren: i > 2 && i % 3 > 0
  }
  for (let j = 1; j < i; j++) {
    const subData: Organization = {
      id: 100 + i,
      name: 'organization_' + i + '_' + j,
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
    name: 'organization_1',
    children: [
      {
        id: 2,
        name: 'organization_2',
        children: [
        ]
      },
      {
        id: 3,
        name: 'organization_3',
        children: [
          {
            id: 4,
            name: 'organization_4',
            children: [
            ]
          }
        ]
      }
    ]
  }
]

export const organizationsHandlers = [
  http.get('/api/organizations/:id', ({ params }) => {
    const { id } = params
    if (id) {
      if (id === 'tree') {
        return HttpResponse.json(treeNodes)
      } else {
        let array = datas.filter(item => item.id === Number(id))
        if (array.length === 0) {
          array = subDatas.filter(item => item.id === Number(id))
        }
        return HttpResponse.json(array[0])
      }
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/organizations/:id/subset', ({ params }) => {
    const superiorId = params.id
    return HttpResponse.json(subDatas.filter(item => item.superiorId === Number(superiorId)))
  }),
  http.get('/api/organizations', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all Organization
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/organizations', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Organization

    // Push the new Organization to the map of all Organization.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Organization!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/organizations/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Organization by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Organization ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Organization from the "allDictionarys" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Organization.
    return HttpResponse.json(deletedData)
  })
]
