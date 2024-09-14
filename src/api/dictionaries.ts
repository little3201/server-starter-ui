import { api } from 'boot/axios'
import { SERVER_URL } from 'src/api/paths'
import type { Dictionary } from 'src/models'

/**
 * retrieve data
 * @param page page
 * @param size size
 * @param params filter or sort
 * @returns data
 */
export const retrieveDictionaries = (page: number, size: number, params?: object) => {
  return api.get(SERVER_URL.DICTIONARY, { params: { page, size, ...params } })
}

/**
 * retrieve subset
 * @param id data id
 * @returns subset data
 */
export const retrieveDictionarySubset = (id: number) => {
  return api.get(`${SERVER_URL.DICTIONARY}/${id}/subset`)
}

export const retrieveDictionaryTree = () => {
  return api.get(`${SERVER_URL.DICTIONARY}/tree`)
}

export const fetchDictionary = (id: number) => {
  return api.get(`${SERVER_URL.DICTIONARY}/${id}`)
}

export const createDictionary = (row: Dictionary) => {
  return api.post(SERVER_URL.DICTIONARY, { data: row })
}

export const modifyDictionary = (id: number, row: Dictionary) => {
  return api.put(`${SERVER_URL.DICTIONARY}/${id}`, { data: row })
}

export const removeDictionary = (id: number) => {
  return api.delete(`${SERVER_URL.DICTIONARY}/${id}`)
}
