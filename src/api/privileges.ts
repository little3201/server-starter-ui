import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrievePrivileges = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.PRIVILEGE, { params: { page: page - 1, size, ...params } })
}

/**
 * Get row subset
 * @param id Row ID
 * @returns Subset data
 */
export const retrievePrivilegeSubset = (id: number) => {
  return api.get(`${SERVER_URL.PRIVILEGE}/${id}/subset`)
}


/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrievePrivilegeTree = () => {
  return api.get(`${SERVER_URL.PRIVILEGE}/tree`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchPrivilege = (id: number) => {
  return api.get(`${SERVER_URL.PRIVILEGE}/${id}`)
}