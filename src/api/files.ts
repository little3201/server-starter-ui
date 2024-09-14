import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { File } from 'src/models'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveFiles = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.FILE, { params: { page, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchFile = (id: number) => {
  return api.get(`${SERVER_URL.FILE}/${id}`)
}

/**
 * Upload
 * @param row Row data
 * @returns Uploaded row
 */
export const uploadFile = (row: File) => {
  return api.post(`${SERVER_URL.FILE}/upload`, row)
}

/**
 * Download 
 * @param id Row ID
 * @returns data stream
 */
export const downloadFile = (id: number) => {
  return api.get(`${SERVER_URL.FILE}/${id}/download`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeFile = (id: number) => {
  return api.delete(`${SERVER_URL.FILE}/${id}`)
}