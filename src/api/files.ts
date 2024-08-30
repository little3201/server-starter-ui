import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

export const retrieveFiles = (page: number, size: number) => {
  return api.get(SERVER_URL.FILE, { params: { page, size } })
}

export const fetchFile = (id: number) => {
  return api.get(`${SERVER_URL.FILE}/${id}`)
}
