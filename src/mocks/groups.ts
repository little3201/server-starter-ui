import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/api/paths'
import type { Group, TreeNode, GroupMembers } from 'src/models'

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

const members: GroupMembers[] = []

for (let i = 1; i < 4; i++) {
  const row: GroupMembers = {
    id: i,
    username: 'username' + i,
    groupId: i
  }
  members.push(row)
}

export const groupsHandlers = [
  http.get(`/api${SERVER_URL.GROUP}/tree`, () => {
    return HttpResponse.json(treeNodes)
  }),
  http.get(`/api${SERVER_URL.GROUP}/:id/members`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(members.filter(item => item.groupId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
  http.get(`/api${SERVER_URL.GROUP}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      let array = datas.filter(item => item.id === Number(id))
      return HttpResponse.json(array[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.GROUP}`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    const superiorId = url.searchParams.get('superiorId')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const filtered = datas.filter(item => item.superiorId === Number(superiorId))
    const data = {
      content: Array.from(filtered.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      page: {
        totalElements: datas.length
      }
    }

    return HttpResponse.json(data)
  }),
  http.post(`/api${SERVER_URL.GROUP}`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Group

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete(`/api${SERVER_URL.GROUP}/:id`, ({ params }) => {
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
