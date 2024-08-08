import { api } from '~/boot/axios'

export const retrieveDepartments = (page: number, size: number, params?: object) => {
  return api.get('/organizations', { params: { page: page - 1, size: size, ...params } })
}

export const retrieveDepartmentSubset = (id: number) => {
  return api.get(`/organizations/${id}/subset`)
}

export const retrieveDepartmentTree = () => {
  return api.get('/organizations/tree')
}

export const fetchDepartment = (id: number) => {
  return api.get(`/organizations/${id}`)
}
