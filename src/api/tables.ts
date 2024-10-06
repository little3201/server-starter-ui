import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Pagination } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveTables = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.TABLE, { params: { ...pagination, page: pagination.page - 1, ...filters } })
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
