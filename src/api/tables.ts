import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveTables = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.TABLE, { params: { page: page - 1, size, ...params } })
}

export const retrieveTableColumns = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}/columns`)
}

export const retrieveTableCodes = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}/codes`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchTable = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}`)
}
