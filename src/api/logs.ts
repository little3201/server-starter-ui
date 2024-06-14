import { api } from '~/composables/axios'

export const retrieveLogs = (page: number, size: number) => {
  return api.get('/logs', { params: { page: page - 1, size: size } })
}

export const fetchLog = (id: number) => {
  return api.get(`/logs/${id}`)
}