import { api } from '~/composables/axios'

export const retrieveRoles = (page: number, size: number, params?: object) => {
  return api.get('/roles', { params: { page: page - 1, size: size, ...params } })
}

export const fetchRole = (id: number) => {
  return api.get(`/roles/${id}`)
}