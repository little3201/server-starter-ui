import { http, HttpResponse } from 'msw'
import type { Group, TreeNode } from 'src/models'

const datas: Group[] = [
  {
    id: 1,
    name: 'group_1',
    enabled: true,
    description: 'This is region description about xxx'
  },
  {
    id: 2,
    superiorId: 1,
    name: 'group_2',
    enabled: true,
    description: 'This is region description about xxx'
  },
  {
    id: 3,
    superiorId: 1,
    name: 'group_3',
    enabled: true,
    description: 'This is region description about xxx'
  },
  {
    id: 4,
    superiorId: 3,
    name: 'group_4',
    enabled: true,
    description: 'This is region description about xxx'
  }
]

const treeNodes: TreeNode[] = [
  {
    id: 1,
    name: 'group_1',
    children: [
      {
        id: 2,
        name: 'group_2',
        children: [
        ]
      },
      {
        id: 3,
        name: 'group_3',
        children: [
          {
            id: 4,
            name: 'group_4',
            children: [
            ]
          }
        ]
      }
    ]
  }
]

export const groupsHandlers = [
  http.get('/api/groups/tree', () => {
    return HttpResponse.json(treeNodes)
  }),
  http.get('/api/groups/:id', ({ params }) => {
    const { id } = params
    if (id) {
      let array = datas.filter(item => item.id === Number(id))
      return HttpResponse.json(array[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/groups', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    const superiorId = url.searchParams.get('superiorId')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const filtered = datas.filter(item => item.superiorId === Number(superiorId))
    const data = {
      content: Array.from(filtered.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/groups', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Group

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/groups/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Row by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Row ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Row from the "allRow" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Row.
    return HttpResponse.json(deletedData)
  })
]
