import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Pagination, Template } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveTemplates = (pagination: Pagination, filters?: object) => {
  return api.get(SERVER_URL.TEMPLATE, { params: { ...pagination, page: pagination.page - 1, ...filters } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchTemplate = (id: number) => {
  return api.get(`${SERVER_URL.TEMPLATE}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createTemplate = (row: Template) => {
  return api.post(SERVER_URL.TEMPLATE, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyTemplate = (id: number, row: Template) => {
  return api.put(`${SERVER_URL.TEMPLATE}/${id}`, row)
}

/**
 * Enable or Disable an existing row
 * @param id Row ID
 * @returns Enable or Disable result
 */
export const enableTemplate = (id: number) => {
  return api.patch(`${SERVER_URL.TEMPLATE}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeTemplate = (id: number) => {
  return api.delete(`${SERVER_URL.TEMPLATE}/${id}`)
}
