import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveOperationLogs = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.OPERATION_LOG, { params: { page: page - 1, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchOperationLog = (id: number) => {
  return api.get(`${SERVER_URL.OPERATION_LOG}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeOperationLog = (id: number) => {
  return api.delete(`${SERVER_URL.OPERATION_LOG}/${id}`)
}