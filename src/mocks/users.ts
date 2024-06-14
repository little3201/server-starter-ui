import { http, HttpResponse } from 'msw'
import type { User } from '~/api/models.type'

const datas: User[] = []

for (let i = 1; i < 20; i++) {
  const data: User = {
    id: i,
    username: 'username' + i, 
    email: 'lastname_' + i + '@test.com',
    role: i,
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
    const deapartmentId = url.searchParams.get('departmentId')
    // Construct a JSON response with the list of all User
    // as the response body.
    let data = {}
    if (deapartmentId) {
      data = {
        content: Array.from(datas.slice(0, Number(deapartmentId))),
        totalElements: datas.length
      }
    } else {
      data = {
        content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
        totalElements: datas.length
      }
    }
    

    return HttpResponse.json(data)
  }),
  http.post('/api/users', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as User

    // Push the new User to the map of all User.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created User!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/users/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the User by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // User ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the User from the "allDictionarys" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted User.
    return HttpResponse.json(deletedData)
  })
]
