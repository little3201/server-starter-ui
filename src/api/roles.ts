import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import type { Pagination, Role } from 'src/types'

/**
 * Retrieve rows
 * @param pagination Pagination
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveRoles = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.ROLE, { params: { ...pagination, page: pagination.page - 1, ...filters } })
}

/**
 * Retrieve members for a specific role
 * @returns tree data
 */
export const retrieveRoleMembers = (id: number) => {
  return api.get(`${SERVER_URL.ROLE}/${id}/members`)
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
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchRole = (id: number) => {
  return api.get(`${SERVER_URL.ROLE}/${id}`)
}

/**
 * Check if a specific row exists by name
 * @param name Row name
 * @param id Row ID
 * @returns Row data
 */
export const checkRoleExists = (name: string, id?: number) => {
  return api.get(`${SERVER_URL.ROLE}/exists`, { params: { name, id } })
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
 * @param row Updated row data
 * @returns Modified row
 */
export const modifyRole = (id: number, row: Role) => {
  return api.put(`${SERVER_URL.ROLE}/${id}`, row)
}

/**
 * Enable or Disable an existing row
 * @param id Row ID
 * @returns Enable or Disable result
 */
export const enableRole = (id: number) => {
  return api.patch(`${SERVER_URL.ROLE}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeRole = (id: number) => {
  return api.delete(`${SERVER_URL.ROLE}/${id}`)
}

/**
 * Relation privileges for a specific role
 * @param id Role ID
 * @param privilegeIds privilege IDs
 */
export const relationRolePrivileges = (id: number, privilegeIds: number[]) => {
  return api.patch(`${SERVER_URL.ROLE}/${id}/privileges`, privilegeIds)
}

/**
 * Remove privileges for a specific role
 * @param id Role ID
 * @param privilegeIds privilege IDs
 */
export const removeRolePrivileges = (id: number, privilegeIds: number[]) => {
  const params = privilegeIds ? { privilegeIds: privilegeIds.join(',') } : {}
  return api.delete(`${SERVER_URL.ROLE}/${id}/privileges`, { params })
}