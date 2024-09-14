import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Retrieve rows
 * @param page Page number
 * @param size Items per page
 * @param params Optional filter or sort parameters
 * @returns Rows data
 */
export const retrieveSchedulerLogs = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.SCHEDULER_LOG, { params: { page, size, ...params } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchSchedulerLog = (id: number) => {
  return api.get(`${SERVER_URL.SCHEDULER_LOG}/${id}`)
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeSchedulerLog = (id: number) => {
  return api.delete(`${SERVER_URL.SCHEDULER_LOG}/${id}`)
}