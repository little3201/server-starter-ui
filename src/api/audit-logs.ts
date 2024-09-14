import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @returns Rows data
 */
export const retrieveAuditLogs = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.AUDIT_LOG, { params: { page, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchAuditLog = (id: number) => {
  return api.get(`${SERVER_URL.AUDIT_LOG}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeAuditLog = (id: number) => {
  return api.delete(`${SERVER_URL.AUDIT_LOG}/${id}`)
}