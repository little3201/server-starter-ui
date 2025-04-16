import { http, HttpResponse } from 'msw'
import { SERVER_URL } from 'src/constants'
import type { Role, RolePrivileges, RoleMembers } from 'src/types'

const datas: Role[] = []

for (let i = 1; i < 28; i++) {
  const data: Role = {
    id: i,
    name: 'role_' + i,
    enabled: i % 3 > 0,
    description: 'this is description for this row'
  }
  datas.push(data)
}

const privileges: RolePrivileges[] = []

for (let i = 1; i < 28; i++) {
  const row: RolePrivileges = {
    id: i,
    privilegeId: i,
    roleId: i
  }
  privileges.push(row)
}

const members: RoleMembers[] = []

for (let i = 1; i < 28; i++) {
  const row: RoleMembers = {
    id: i,
    username: 'username' + i,
    roleId: i
  }
  members.push(row)
}

export const rolesHandlers = [
  http.get(`/api${SERVER_URL.ROLE}/:id/privileges`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(privileges.filter(item => item.roleId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
  http.get(`/api${SERVER_URL.ROLE}/:id/members`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(members.filter(item => item.roleId === Number(id)))
    } else {
      return HttpResponse.json([])
    }
  }),
  http.get(`/api${SERVER_URL.ROLE}/:id`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json(datas.filter(item => item.id === Number(id))[0])
    } else {
      return HttpResponse.json(null)
    }
  }),
  http.get(`/api${SERVER_URL.ROLE}`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const size = url.searchParams.get('size')
    if (page && size) {
      // Construct a JSON response with the list of all Row
      // as the response body.
      const data = {
        content: Array.from(datas.slice(Number(page) * Number(size), (Number(page) + 1) * Number(size))),
        page: {
          totalElements: datas.length
        }
      }
      return HttpResponse.json(data)
    } else {
      return HttpResponse.json(datas)
    }
  }),
  http.post(`/api${SERVER_URL.ROLE}`, async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newData = await request.json() as Role

    // Push the new Row to the map of all Row.
    datas.push(newData)

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created Row!
    return HttpResponse.json(newData, { status: 201 })
  }),
  http.patch(`/api${SERVER_URL.ROLE}/:id/members`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.delete(`/api${SERVER_URL.ROLE}/:id/members`, ({ params }) => {
    const { id } = params
    if (id) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.patch(`/api${SERVER_URL.ROLE}/privileges/:privilegeId`, async({ params, request }) => {
    const { ids, actions } = await request.json() as {ids:'', actions:''}
    const { privilegeId } = params
    if (privilegeId && ids.length && actions.length) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.delete(`/api${SERVER_URL.ROLE}/privileges/:privilegeId`, async({ params, request }) => {
    const searchParams = new URLSearchParams(request.url)
    const ids = searchParams.get('ids')
  
    const { privilegeId } = params
    if (privilegeId && ids && ids.length) {
      return HttpResponse.json()
    } else {
      return HttpResponse.error()
    }
  }),
  http.delete(`/api${SERVER_URL.ROLE}/:id`, ({ params }) => {
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
