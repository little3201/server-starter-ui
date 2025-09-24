import { http, HttpResponse } from 'msw'
import type { User } from 'src/types'
import { SERVER_URL } from 'src/constants'
import { dayjs } from 'element-plus'

const datas: User[] = []

for (let i = 1; i < 28; i++) {
  const row: User = {
    id: i,
    username: 'username' + i,
    fullname: '张三' + i,
    avatar: '',
    email: 'use***' + '@**t.com',
    accountNonLocked: i % 2 > 0,
    enabled: i % 2 > 0,
    accountExpiresAt: dayjs().add(Math.floor(Math.random() * 30), 'day').toDate(),
    credentialsExpiresAt: dayjs().add(Math.floor(Math.random() * 30), 'day').toDate()
  }
  datas.push(row)
}

export const usersHandlers = [
  http.get(`/api${SERVER_URL.USER}/me`, () => {
    return HttpResponse.json({
      id: 1,
      username: 'admin',
      fullname: '勒布朗 詹姆斯 雷蒙',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      email: 'test@test.com',
      accountExpiresAt: null,
      accountNonLocked: true,
      credentialsExpiresAt: null,
      enabled: true,
      lastModifiedDate: null
    })
  }),
  http.get(`/api${SERVER_URL.USER}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json()
    }
  }),
  http.get(`/api${SERVER_URL.USER}/:id/exists`, ({ params }) => {
    const { id, username } = params
    let filtered = datas.filter(item => item.username === username)
    if (id) {
      filtered = datas.filter(item => item.username === username && item.id !== Number(id))
    }
    return HttpResponse.json(filtered.length > 0)
  }),
  http.get(`/api${SERVER_URL.USER}`, ({ request }) => {
    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    // Construct a JSON response with the list of all Row
    // as the response body.
    const data = {
      content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
      page: {
        totalElements: datas.length
      }
    }

    return HttpResponse.json(data)
  }),
  http.post(`/api${SERVER_URL.USER}/import`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const data = await request.formData()
    const file = data.get('file')
    
    if (!file) {
      return new HttpResponse('Missing document', { status: 400 })
    }
  
    if (!(file instanceof File)) {
      return new HttpResponse('Uploaded document is not a File', {
        status: 400,
      })
    }
    return HttpResponse.json()
  }),
  http.post(`/api${SERVER_URL.USER}`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as User

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.put(`/api${SERVER_URL.USER}/:id`, async ({ params, request }) => {
    const { id } = params
    // Read the intercepted request body as JSON.
    const newData = await request.json() as User

    if (id && newData) {
      // Don't forget to declare a semantic "201 Created"
      // response and send back the newly created Row!
      return HttpResponse.json({...newData, id: id}, { status: 202 })
    } else {
      return HttpResponse.error()
    }
  }),
  http.patch(`/api${SERVER_URL.USER}/:id`, async({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.patch(`/api${SERVER_URL.USER}/:id/unlock`, async({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.patch(`/api${SERVER_URL.USER}/privileges/:privilegeId`, async({ params, request }) => {
    const data = await request.json()
    const { privilegeId } = params
    if (privilegeId && data) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.delete(`/api${SERVER_URL.USER}/:username/privileges/:privilegeId`, async({ params }) => {
    const { username, privilegeId } = params
    if (username && privilegeId) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.delete(`/api${SERVER_URL.USER}/:id`, ({ params }) => {
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
