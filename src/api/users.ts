import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { User } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param organizationId organization ID
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveUsers = (page: number, size: number, organizationId: number | undefined, params?: object) => {
  return api.get(SERVER_URL.USER, { params: { page, size, organizationId, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchUser = (id: number) => {
  return api.get(`${SERVER_URL.USER}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createUser = (row: User) => {
  return api.post(SERVER_URL.USER, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyUser = (id: number, row: User) => {
  return api.put(`${SERVER_URL.USER}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeUser = (id: number) => {
  return api.delete(`${SERVER_URL.USER}/${id}`)
}
