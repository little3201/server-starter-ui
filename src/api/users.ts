import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import type { Pagination, User } from 'src/types'

/**
 * Retrieve rows
 * @param pagination Pagination and sort parameters
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveUsers = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.USER, { params: { ...pagination, page: pagination.page - 1, ...filters } })
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
 * Check if a specific row exists by username
 * @param username Row username
 * @param id Row ID
 * @returns Row data
 */
export const checkUserExists = (username: string, id?: number) => {
  return api.get(`${SERVER_URL.USER}/exists`, { params: { username, id } })
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
 * @param row Updated row data
 * @returns Modified row
 */
export const modifyUser = (id: number, row: User) => {
  return api.put(`${SERVER_URL.USER}/${id}`, row)
}

/**
 * Enable or Disable an existing row
 * @param id Row ID
 * @returns Enable or Disable result
 */
export const enableUser = (id: number) => {
  return api.patch(`${SERVER_URL.USER}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeUser = (id: number) => {
  return api.delete(`${SERVER_URL.USER}/${id}`)
}
