import { api } from 'boot/axios'

export const retrieveOrganizations = (page: number, size: number, superiorId: number | undefined, params?: object) => {
  return api.get('/organizations', { params: { page: page, size: size, superiorId: superiorId, ...params } })
}

export const retrieveOrganizationTree = () => {
  return api.get('/organizations/tree')
}

export const fetchOrganization = (id: number) => {
  return api.get(`/organizations/${id}`)
}
