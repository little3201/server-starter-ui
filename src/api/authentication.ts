import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'

/**
 * Sign in
 * @param username username
 * @param password password
 * @returns token
 */
export const signin = (username: string, password: string) => {
  return api.post(SERVER_URL.SIGNIN, null, { auth: { username, password } })
}

/**
 * Sign out
 * @returns Promise
 */
export const signout = () => {
  return api.post(SERVER_URL.SIGNOUT)
}
