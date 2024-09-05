import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

export const retrieveScripts = () => {
  return api.get(SERVER_URL.SCRIPT)
}

export const fetchScript = (id: number) => {
  return api.get(`${SERVER_URL.SCRIPT}/${id}`)
}
