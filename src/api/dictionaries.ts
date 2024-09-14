import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Dictionary } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveDictionaries = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.DICTIONARY, { params: { page, size, ...params } })
}

/**
 * Get row subset
 * @param id Row ID
 * @returns Subset data
 */
export const retrieveDictionarySubset = (id: number) => {
  return api.get(`${SERVER_URL.DICTIONARY}/${id}/subset`)
}

/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrieveDictionaryTree = () => {
  return api.get(`${SERVER_URL.DICTIONARY}/tree`)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchDictionary = (id: number) => {
  return api.get(`${SERVER_URL.DICTIONARY}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createDictionary = (row: Dictionary) => {
  return api.post(SERVER_URL.DICTIONARY, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param data Updated row data
 * @returns Modified row
 */
export const modifyDictionary = (id: number, row: Dictionary) => {
  return api.put(`${SERVER_URL.DICTIONARY}/${id}`, row)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeDictionary = (id: number) => {
  return api.delete(`${SERVER_URL.DICTIONARY}/${id}`)
}
