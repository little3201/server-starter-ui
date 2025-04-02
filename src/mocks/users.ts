import { http, HttpResponse } from 'msw'
import type { User } from 'src/types'
import { SERVER_URL } from 'src/constants'
import { dayjs } from 'element-plus'

const datas: User[] = []

for (let i = 1; i < 28; i++) {
  const row: User = {
    id: i,
    username: 'username' + i,
    givenName: 'given name' + i,
    familyName: 'family name' + i,
    avatar: '/images/avatar.jpg',
    email: 'usexxx' + '@test.com',
    accountNonLocked: i % 2 > 0,
    enabled: i % 2 > 0,
    accountExpiresAt: dayjs().add(Math.floor(Math.random() * 30), 'day').toDate(),
    credentialsExpiresAt: dayjs().add(Math.floor(Math.random() * 30), 'day').toDate()
  }
  datas.push(row)
}

export const usersHandlers = [
  http.get(`/api${SERVER_URL.USERINFO}`, () => {
    return HttpResponse.json({
      sub: 'username'
    })
  }),
  http.get(`/api${SERVER_URL.USER}/me`, () => {
    return HttpResponse.json({
      id: 1,
      enabled: true,
      lastModifiedDate: null,
      username: 'admin',
      givenName: '勒布朗',
      familyName: '詹姆斯',
      middleName: '雷蒙',
      avatar: '/images/avatar.jpg',
      email: 'test@test.com',
      accountExpiresAt: null,
      accountNonLocked: true,
      credentialsExpiresAt: null
    })
  }),
  http.get(`/api${SERVER_URL.USER}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.USER}`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
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
  http.post(`/api${SERVER_URL.USER}`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as User

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
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
