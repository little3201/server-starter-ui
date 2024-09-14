import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Region } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveRegions = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.REGION, { params: { page, size, ...params } })
}

export const retrieveRegionSubset = (id: number, page: number, size: number, params?: object) => {
  return api.get(`${SERVER_URL.REGION}/${id}/subset`, { params: { page, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchRegion = (id: number) => {
  return api.get(`${SERVER_URL.REGION}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createRegion = (row: Region) => {
  return api.post(SERVER_URL.REGION, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyRegion = (id: number, row: Region) => {
  return api.put(`${SERVER_URL.REGION}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeRegion = (id: number) => {
  return api.delete(`${SERVER_URL.REGION}/${id}`)
}