import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import type { Script } from 'src/types'

/**
 * Retrieve rows
 * @param filters Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveScripts = () => {
  return api.get(SERVER_URL.SCRIPT)
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchScript = (id: number) => {
  return api.get(`${SERVER_URL.SCRIPT}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createScript = (row: Script) => {
  return api.post(SERVER_URL.SCRIPT, row)
}

/**
 * Check if a specific row exists by name
 * @param name Row name
 * @param id Row ID
 * @returns Row data
 */
export const checkScriptExists = (name: string, id?: number) => {
  return api.get(`${SERVER_URL.SCRIPT}/exists`, { params: { name, id } })
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param row Updated row data
 * @returns Modified row
 */
export const modifyScript = (id: number, row: Script) => {
  return api.put(`${SERVER_URL.SCRIPT}/${id}`, row)
}

/**
 * Import rows
 * @param file file
 * @returns
 */
export const importScripts = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`${SERVER_URL.SCRIPT}/import`, formData)
}
