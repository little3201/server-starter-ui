import { api } from '~/boot/axios'

export const retrieveActionLogs = (page: number, size: number) => {
  return api.get('/operations-logs', { params: { page: page - 1, size: size } })
}

export const fetchActionLog = (id: number) => {
  return api.get(`/operations-logs/${id}`)
}