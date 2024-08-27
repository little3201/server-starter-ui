import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

export const retrieveUsers = (page: number, size: number, organizationId: number | undefined, params?: object) => {
  return api.get(SERVER_URL.USER, { params: { page, size, organizationId, ...params } })
}

export const fetchUser = (id: number) => {
  return api.get(`${SERVER_URL.USER}/${id}`)
}
