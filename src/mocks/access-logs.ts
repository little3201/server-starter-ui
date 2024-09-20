import { http, HttpResponse } from 'msw'
import type { AccessLog } from 'src/models'

const datas: AccessLog[] = [
  {
    id: 1,
    operator: 'admin',
    api: '/users',
    method: 'POST',
    params: '{"operator:"john", "role:"admin"}',
    ip: '192.168.0.1',
    location: 'New York',
    responseTime: 120,
    responseCode: 404,
    responseMessage: 'Non Content'
  },
  {
    id: 2,
    operator: 'john',
    api: '/profile',
    method: 'PUT',
    params: '{"email:"john@example.com"}',
    ip: '192.168.0.2',
    location: 'London',
    responseTime: 100,
    responseCode: 502,
    responseMessage: 'Network Error'
  },
  {
    id: 3,
    operator: 'alice',
    api: '/posts/123',
    method: 'DELETE',
    params: null,
    ip: '192.168.0.3',
    location: 'San Francisco',
    responseTime: 150,
    responseCode: 200,
    responseMessage: 'Success'
  },
  {
    id: 4,
    operator: 'bob',
    api: '/files',
    method: 'POST',
    params: '{"file_name:"report.pdf"}',
    ip: '192.168.0.4',
    location: 'Berlin',
    responseTime: 300,
    responseCode: 400,
    responseMessage: 'File too large'
  },
  {
    id: 5,
    operator: 'carol',
    api: '/login',
    method: 'POST',
    params: '{}',
    ip: '192.168.0.5',
    location: 'Paris',
    responseTime: 80,
    responseCode: 200,
    responseMessage: 'Success'
  },
  {
    id: 6,
    operator: 'dave',
    api: '/logout',
    method: 'POST',
    params: '{}',
    ip: '192.168.0.6',
    location: 'Tokyo',
    responseTime: 90,
    responseCode: 500,
    responseMessage: 'Network Request Timeout'
  },
  {
    id: 7,
    operator: 'admin',
    api: '/users/2/password',
    method: 'PUT',
    params: '{"new_password:"secret"}',
    ip: '192.168.0.1',
    location: 'New York',
    responseTime: 110,
    responseCode: 200,
    responseMessage: 'Success'
  }
]

export const accessLogsHandlers = [
  http.get('/api/access-logs/:id', ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/access-logs', ({ request }) => {
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
  http.delete('/api/access-logs/:id', ({ params }) => {
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
