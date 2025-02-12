import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'

/**
 * login
 * @param username username
 * @param password password
 * @returns Promise
 */
export const login = async () => {
  window.location.href = 'http://127.0.0.1:8760';
}

/**
 * logout
 * @returns Promise
 */
export const logout = () => {
  return api.post(SERVER_URL.LOGOUT)
}
