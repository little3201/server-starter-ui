import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Organization } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param superiorId superior ID
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveOrganizations = (page: number, size: number, superiorId: number | undefined, params?: object) => {
  return api.get(SERVER_URL.ORGANIZATION, { params: { page: page, size: size, superiorId: superiorId, ...params } })
}

/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrieveOrganizationTree = () => {
  return api.get(`${SERVER_URL.ORGANIZATION}/tree`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchOrganization = (id: number) => {
  return api.get(`${SERVER_URL.ORGANIZATION}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createOrganization = (row: Organization) => {
  return api.post(SERVER_URL.ORGANIZATION, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyOrganization = (id: number, row: Organization) => {
  return api.put(`${SERVER_URL.ORGANIZATION}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeOrganization = (id: number) => {
  return api.delete(`${SERVER_URL.ORGANIZATION}/${id}`)
}