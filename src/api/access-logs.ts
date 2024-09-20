import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @returns Rows data
 */
export const retrieveAccessLogs = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.ACCESS_LOG, { params: { page: page - 1, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchAccessLog = (id: number) => {
  return api.get(`${SERVER_URL.ACCESS_LOG}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeAccessLog = (id: number) => {
  return api.delete(`${SERVER_URL.ACCESS_LOG}/${id}`)
}