import { api } from '~/boot/axios'

export const retrievePrivileges = (page: number, size: number, params?: object) => {
  return api.get('/privileges', { params: { page: page - 1, size: size, ...params } })
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
