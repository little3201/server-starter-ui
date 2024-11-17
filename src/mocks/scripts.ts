import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/api/paths'
import type { Script } from 'src/models'

const datas: Script[] = [
  {
    id: 1,
    name: 'MySQL',
    icon: '/svgs/mysql.svg',
    version: '8.0.34',
    description: 'This is the description of row',
    lastModifiedDate: new Date()
  },
  {
    id: 2,
    name: 'Nginx',
    icon: '/svgs/nginx.svg',
    version: '1.8.12',
    description: 'This is the description of row',
    lastModifiedDate: new Date()
  },
  {
    id: 3,
    name: 'Nodejs',
    icon: '/svgs/nodejs.svg',
    version: '20.5.6',
    description: 'This is the description of row',
    lastModifiedDate: new Date()
  },
  {
    id: 4,
    name: 'PostgreSql',
    icon: '/svgs/postgresql.svg',
    version: '16.2.3',
    description: 'This is the description of row',
    lastModifiedDate: new Date()
  },
  {
    id: 5,
    name: 'Redis',
    icon: '/svgs/redis.svg',
    version: '7.0.1',
    description: 'This is the description of row',
    lastModifiedDate: new Date()
  }
]

export const scriptsHandlers = [
  http.get(`/api${SERVER_URL.SCRIPT}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.SCRIPT}`, () => {
    // Construct a JSON response with the list of all Row
    // as the response body.

    return HttpResponse.json(datas)
  }),
  http.delete(`/api${SERVER_URL.SCRIPT}/:id`, ({ params }) => {
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
