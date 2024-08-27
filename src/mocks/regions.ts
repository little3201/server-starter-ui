import { http, HttpResponse } from 'msw'
import type { Region } from 'src/models'

const datas: Region[] = []
const subDatas: Region[] = []

for (let i = 1; i < 34; i++) {
  const data: Region = {
    id: i,
    name: 'region_' + i,
    areaCode: (11 + i) * 10000,
    postalCode: (11 + i),
    count: i - 1,
    enabled: i % 3 > 0,
    description: 'This is region description about xxx'
  }
  for (let j = 0; j < i; j++) {
    const subData: Region = {
      id: 100 + j,
      name: 'region_' + i + '_' + j,
      superiorId: i,
      areaCode: data.areaCode + j,
      postalCode: data.postalCode + j,
      count: 0,
      enabled: j % 2 > 0,
      description: 'This is region description about xxx'
    }
    subDatas.push(subData)
  }
  datas.push(data)
}

export const regionsHandlers = [
  http.get('/api/regions/:id/subset', ({ params }) => {
    const { id } = params
    return HttpResponse.json(subDatas.filter(item => item.superiorId === Number(id)))
  }),
  http.get('/api/regions/:id', ({ params }) => {
    const { id } = params
    if (id) {
      let res = datas.filter(item => item.id === Number(id))[0]
      if (!res) {
        res = subDatas.filter(item => item.id === Number(id))[0]
      }
      return HttpResponse.json(res)
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get('/api/regions', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    // Construct a JSON response with the list of all privilege
    // as the response body.
    const data = {
      content: Array.from(datas.slice((Number(page) - 1) * Number(size), Number(page) * Number(size))),
      totalElements: datas.length
    }

    return HttpResponse.json(data)
  }),
  http.post('/api/regions', async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Region

    // Push the new Dictionary to the map of all Dictionarys.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Dictionary!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.delete('/api/regions/:id', ({ params }) => {
    // All request path params are provided in the "params"
    // argument of the response resolver.
    const { id } = params

    // Let's attempt to grab the Dictionary by its ID.
    const deletedData = datas.filter(item => item.id === Number(id))

    // Respond with a "404 Not Found" response if the given
    // Dictionary ID does not exist.
    if (!deletedData) {
      return new HttpResponse(null, { status: 404 })
    }

    // Delete the Dictionary from the "allDictionarys" map.
    datas.pop()

    // Respond with a "200 OK" response and the deleted Dictionary.
    return HttpResponse.json(deletedData)
  })
]
