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
export const retrieveSchemas = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.SCHEMA, { params: { ...pagination, page: pagination.page - 1, ...filters } })
}

export const retrieveSchemaFields = (id: number) => {
  return api.get(`${SERVER_URL.SCHEMA}/${id}/columns`)
}

export const retrieveSchemaCodes = (id: number) => {
  return api.get(`${SERVER_URL.SCHEMA}/${id}/codes`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchSchema = (id: number) => {
  return api.get(`${SERVER_URL.SCHEMA}/${id}`)
}
