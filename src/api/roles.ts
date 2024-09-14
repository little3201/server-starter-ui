import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Role } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveRoles = (page?: number, size?: number, params?: object) => {
  if (page && size) {
    return api.get(SERVER_URL.ROLE, { params: { page, size, ...params } })
  }
  return api.get(SERVER_URL.ROLE)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchRole = (id: number) => {
  return api.get(`${SERVER_URL.ROLE}/${id}`)
}

/**
 * Retrieve privileges for a specific role
 * @param id Role ID
 * @returns Role privileges
 */
export const retrieveRolePrivileges = (id: number) => {
  return api.get(`${SERVER_URL.ROLE}/${id}/privileges`)
}

/**
 * Retrieve organizations associated with a role
 * @param id Role ID
 * @returns Role organizations
 */
export const retrieveRoleOrganizations = (id: number) => {
  return api.get(`${SERVER_URL.ROLE}/${id}/organizations`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createRole = (row: Role) => {
  return api.post(SERVER_URL.ROLE, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyRole = (id: number, row: Role) => {
  return api.put(`${SERVER_URL.ROLE}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeRole = (id: number) => {
  return api.delete(`${SERVER_URL.ROLE}/${id}`)
}
