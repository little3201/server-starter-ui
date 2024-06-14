import { api } from '~/composables/axios'

export const retrieveUsers = (page: number, size: number, departmentId: number | undefined, params?: object) => {
  return api.get('/users', { params: { page: page - 1, size: size, departmentId: departmentId, ...params } })
}

export const fetchUser = (id: number) => {
  return api.get(`/users/${id}`)
}