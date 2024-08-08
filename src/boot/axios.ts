import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const PATH_URL = import.meta.env.VITE_API_BASE_PATH

const abortControllerMap: Map<string, AbortController> = new Map()

const api: AxiosInstance = axios.create({
  baseURL: PATH_URL,
  timeout: 10000
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = config.url || ''
  config.signal = controller.signal
  abortControllerMap.set(url, controller)
  defaultRequestInterceptors(config)
  return config
})

api.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    ElMessage.error({ message: error.message, grouping: true })
    return Promise.reject(error)
  }
)

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    Object.keys(config.params).forEach(key => {
      if (config.params[key] !== undefined && config.params[key] !== null && config.params[key] !== '') {
        url += `${key}=${encodeURIComponent(config.params[key])}&`;
      }
    })
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const cancelRequest = (url: string | string[]) => {
  const urlList = Array.isArray(url) ? url : [url]
  for (const _url of urlList) {
    abortControllerMap.get(_url)?.abort()
    abortControllerMap.delete(_url)
  }
}

const cancelAllRequest = () => {
  for (const [_, controller] of abortControllerMap) {
    controller.abort()
  }
  abortControllerMap.clear()
}

export { api, cancelRequest, cancelAllRequest }