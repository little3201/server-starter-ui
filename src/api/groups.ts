import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Group } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param superiorId superior ID
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveGroups = (page: number, size: number, superiorId: number | undefined, params?: object) => {
  return api.get(SERVER_URL.GROUP, { params: { page: page - 1, size: size, superiorId, ...params } })
}

/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrieveGroupTree = () => {
  return api.get(`${SERVER_URL.GROUP}/tree`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchGroup = (id: number) => {
  return api.get(`${SERVER_URL.GROUP}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createGroup = (row: Group) => {
  return api.post(SERVER_URL.GROUP, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyGroup = (id: number, row: Group) => {
  return api.put(`${SERVER_URL.GROUP}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeGroup = (id: number) => {
  return api.delete(`${SERVER_URL.GROUP}/${id}`)
}