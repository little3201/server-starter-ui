import { api } from 'boot/axios'
import { SERVER_URL } from 'src/constants'


export async function signIn(username: string, password: string) {
  return api.post(SERVER_URL.LOGIN, new URLSearchParams({
    username,
    password
  }))
}

export function signOut() {
  return api.post(SERVER_URL.LOGOUT)
}