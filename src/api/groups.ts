import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import type { Pagination, Group } from 'src/types'

/**
 * Retrieve rows
 * @param pagination Pagination and sort parameters
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveGroups = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.GROUP, { params: { ...pagination, page: pagination.page - 1, ...filters } })
}

/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrieveGroupTree = () => {
  return api.get(`${SERVER_URL.GROUP}/tree`)
}

/**
 * Retrieve members for a specific row
 * @returns tree data
 */
export const retrieveGroupMembers = (id: number) => {
  return api.get(`${SERVER_URL.GROUP}/${id}/members`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchGroup = (id: number) => {
  return api.get(`${SERVER_URL.GROUP}/${id}`)
}

/**
 * Check if a specific row exists by name
 * @param name Row name
 * @param id Row ID
 * @returns Row data
 */
export const checkGroupExists = (name: string, id?: number) => {
  return api.get(`${SERVER_URL.GROUP}/exists`, { params: { name, id } })
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createGroup = (row: Group) => {
  return api.post(SERVER_URL.GROUP, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param row Updated row data
 * @returns Modified row
 */
export const modifyGroup = (id: number, row: Group) => {
  return api.put(`${SERVER_URL.GROUP}/${id}`, row)
}

/**
 * Enable or Disable an existing row
 * @param id Row ID
 * @returns Enable or Disable result
 */
export const enableGroup = (id: number) => {
  return api.patch(`${SERVER_URL.GROUP}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeGroup = (id: number) => {
  return api.delete(`${SERVER_URL.GROUP}/${id}`)
}

/**
 * Relation members for a specific row
 * @param id Row ID
 * @param usernames usernames
 */
export const relationGroupMembers = (id: number, usernames: string[]) => {
  return api.patch(`${SERVER_URL.GROUP}/${id}/members`, usernames)
}

/**
 * Remove members for a specific row
 * @param id Row ID
 * @param usernames usernames
 */
export const removeGroupMembers = (id: number, usernames: string[]) => {
  const params = usernames ? { usernames: usernames.join(',') } : {}
  return api.delete(`${SERVER_URL.GROUP}/${id}/members`, { params })
}

/**
 * Relation roles for a specific row
 * @param id Row ID
 * @param roleIds Role ids
 */
export const relationGroupRoles = (id: number, roleIds: number[]) => {
  return api.patch(`${SERVER_URL.GROUP}/${id}/roles`, roleIds)
}

/**
 * Remove members for a specific row
 * @param id Row ID
 * @param roleIds Role ids
 */
export const removeGroupRoles = (id: number, roleIds: number[]) => {
  const params = roleIds ? { roleIds: roleIds.join(',') } : {}
  return api.delete(`${SERVER_URL.GROUP}/${id}/roles`, { params })
}

/**
 * Relation privileges for a specific row
 * @param ids Row IDs
 * @param privilegeIds Privilege id
 * @param actions Actions
 */
export const relationGroupsPrivileges = (ids: number[], privilegeId: number, actions: string[]) => {
  return api.patch(`${SERVER_URL.GROUP}/privileges/${privilegeId}`, { ids, actions })
}

/**
 * Remove privileges for a specific row
 * @param ids Row IDs
 * @param privilegeIds Privilege id
 * @param actions Actions
 */
export const removeGroupsPrivileges = (ids: number[], privilegeId: number, actions: string[]) => {
  const params = { ids: ids.join(','), actions: actions.join(',') }
  return api.delete(`${SERVER_URL.GROUP}/privileges/${privilegeId}`, { params })
}