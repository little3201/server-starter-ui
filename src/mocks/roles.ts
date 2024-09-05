import { http, HttpResponse } from 'msw'
import type { Role } from 'src/models'

const datas: Role[] = []
const rolePrivileges: number[] = [
  2, 3, 4, 5
]
const roleDepartments: number[] = [
  1, 2, 3
]

for (let i = 1; i < 28; i++) {
  const data: Role = {
    id: i,
    name: 'role_' + i,
    privileges: i,
    enabled: i % 3 > 0,
    description: 'this is description for this row'
  }
  datas.push(data)
}

export const rolesHandlers = [
  http.get('/api/roles/:id/:param', ({ params }) => {
    const { id, param } = params
    if (id) {
      if (param === 'privileges') {
        return HttpResponse.json(rolePrivileges)
      } else if (param === 'organizations') {
        return HttpResponse.json(roleDepartments)
      }
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/roles/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/roles', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    if (page && size) {
      // Construct a JSON response with the list of all Row
      // as the response body.
      const data = {
        content: Array.from(datas.slice((Number(page) - 1) * Number(size), Number(page) * Number(size))),
        totalElements: datas.length
      }
      return HttpResponse.json(data)
    } else {
      return HttpResponse.json(datas)
    }
  }),
  http.post('/api/roles', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Role

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/roles/:id', ({ params }) => {
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
