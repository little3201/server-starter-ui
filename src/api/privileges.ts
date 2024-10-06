import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

/**
 * Fetch row tree structure
 * @returns tree data
 */
export const retrievePrivilegeTree = () => {
  return api.get(`${SERVER_URL.PRIVILEGE}`)
}