import { api } from '~/boot/axios'

export const retrieveRegions = (page?: number, size?: number, params?: object) => {
  if (page && size) {
    return api.get('/regions', { params: { page: page - 1, size: size, ...params } })
  }
  return api.get('/regions')
}

export const fetchRegion = (id: number) => {
  return api.get(`/regions/${id}`)
}

export const retrieveRegionPrivileges = (id: number) => {
  return api.get(`/regions/${id}/privileges`)
}

export const retrieveRegionDepartments = (id: number) => {
  return api.get(`/regions/${id}/organizations`)
}