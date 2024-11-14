import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Pagination, Schema, Field } from 'src/models'

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
  return api.get(`${SERVER_URL.SCHEMA}/${id}/fields`)
}

export const retrieveSchemaPreview = (id: number) => {
  return api.get(`${SERVER_URL.SCHEMA}/${id}/preview`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchSchema = (id: number) => {
  return api.get(`${SERVER_URL.SCHEMA}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createSchema = (row: Schema) => {
  return api.post(SERVER_URL.SCHEMA, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifySchema = (id: number, row: Schema) => {
  return api.put(`${SERVER_URL.SCHEMA}/${id}`, row)
}

/**
 * Sync a existing row
 * @param id Row ID
 * @returns Created row
 */
export const syncSchema = (id: number) => {
  return api.patch(`${SERVER_URL.SCHEMA}/${id}`)
}

/**
 * Generate
 * @param id Row ID
 * @returns Created row
 */
export const generateSchema = (id: number) => {
  return api.patch(`${SERVER_URL.SCHEMA}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeSchema = (id: number) => {
  return api.delete(`${SERVER_URL.SCHEMA}/${id}`)
}

export const configSchemaFields = (id: number, rows: Array<Field>) => {
  return api.patch(`${SERVER_URL.SCHEMA}/${id}/fields`, rows)
}
