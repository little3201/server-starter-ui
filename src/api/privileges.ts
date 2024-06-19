import { api } from '~/composables/axios'

export const retrievePrivileges = (page: number, size: number, params?: object) => {
  return api.get('/privileges', { params: { page: page - 1, size: size, ...params } })
}

export const retrievePrivilegeSubset = (id: number) => {
  return api.get(`/privileges/${id}/subset`)
}

export const retrievePrivilegeTree = (username?: string) => {
  if (username) {
    return api.get(`/privileges/${username}`)
  }
  return api.get(`/privileges/tree`)
}

export const fetchPrivilege = (id: number) => {
  return api.get(`/privileges/${id}`)
}
