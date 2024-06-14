import { api } from '~/composables/axios'

export const retrieveDepartments = (page: number, size: number, params?: object) => {
  return api.get('/departments', { params: { page: page - 1, size: size, ...params } })
}

export const retrieveDepartmentSubset = (id: number) => {
  return api.get(`/departments/${id}/subset`)
}

export const retrieveDepartmentTree = () => {
  return api.get('/departments/tree')
}

export const fetchDepartment = (id: number) => {
  return api.get(`/departments/${id}`)
}
