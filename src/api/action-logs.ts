import { api } from '~/composables/axios'

export const retrieveActionLogs = (page: number, size: number) => {
  return api.get('/action-logs', { params: { page: page - 1, size: size } })
}

export const fetchActionLog = (id: number) => {
  return api.get(`/action-logs/${id}`)
}