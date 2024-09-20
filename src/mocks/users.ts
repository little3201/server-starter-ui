import { http, HttpResponse } from 'msw'
import type { User } from 'src/models'

const datas: User[] = []

for (let i = 1; i < 28; i++) {
  const data: User = {
    id: i,
    username: 'username' + i,
    avatar: '/src/assets/images/avatar.jpg',
    email: 'username' + i + '@test.com',
    role: Math.floor((Math.random() * 10)),
    group: Math.floor((Math.random() * 10)),
    accountNonLocked: i % 2 > 0,
    enabled: i % 2 > 0
  }
  datas.push(data)
}

export const usersHandlers = [
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    const groupId = url.searchParams.get('groupId')
    // Construct a JSON response with the list of all Row
    // as the response body.
    let data = {}
    if (groupId) {
      if (Number(groupId) === 1) {
        data = {
          content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
          totalElements: datas.length
        }
      } else {
        let filtered = datas.filter(item => item.group === Number(groupId))
        data = {
          content: Array.from(filtered.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
          totalElements: datas.length
        }
      }
    } else {
      data = {
        content: Array.from(datas.slice(Number(page) * Number(size), Number(page) * Number(size))),
        totalElements: datas.length
      }
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/users', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as User

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/users/:id', ({ params }) => {
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
