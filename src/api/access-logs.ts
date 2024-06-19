import { api } from '~/composables/axios'

export const retrieveAccessLogs = (page: number, size: number) => {
  return api.get('/access-logs', { params: { page: page - 1, size: size } })
}

export const fetchAccessLog = (id: number) => {
  return api.get(`/access-logs/${id}`)
}