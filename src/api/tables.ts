import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'

export const retrieveTables = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.TABLE, { params: { page, size, ...params } })
}

export const retrieveTableColumns = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}/columns`)
}

export const retrieveTableCodes = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}/codes`)
}

export const fetchTable = (id: number) => {
  return api.get(`${SERVER_URL.TABLE}/${id}`)
}
