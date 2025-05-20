import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'
import type { Pagination, Database } from 'src/types'


/**
 * Retrieve rows
 * @returns Rows data
 */
export const retrieveDatabases = (pagination: Pagination, filters?: object) => {
  return api.get(`${SERVER_URL.DB}`, { params: { ...pagination, page: pagination.page - 1, ...filters } })
}

/**
 * Fetch a specific row
 * @param id Row ID
 * @returns Row data
 */
export const fetchDatabase = (id: number) => {
  return api.get(`${SERVER_URL.DB}/${id}`)
}

/**
 * Create a new row
 * @param row Row data
 * @returns Created row
 */
export const createDatabase = (row: Database) => {
  return api.post(SERVER_URL.DB, row)
}

/**
 * Modify an existing row
 * @param id Row ID
 * @param row Updated row data
 * @returns Modified row
 */
export const modifyDatabase = (id: number, row: Database) => {
  return api.put(`${SERVER_URL.DB}/${id}`, row)
}

/**
 * Retrieve rows
 * @returns Rows data
 */
export const retrieveTables = (row: Database) => {
  const params = { host: row.host, port: row.port, name: row.name, username: row.username, password: row.password }
  return api.get(`${SERVER_URL.DB}/tables`, { params })
}

/**
 * Remove a row
 * @param id Row ID
 * @returns Deletion status
 */
export const removeDatabase = (id: number) => {
  return api.delete(`${SERVER_URL.DB}/${id}`)
}
