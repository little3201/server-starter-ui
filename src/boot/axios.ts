import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'


const abortControllerMap: Map<string, AbortController> = new Map()

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_API,
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
    // 创建 AbortController 实例
    const controller = new AbortController()
    // 将 signal 添加到请求配置中
    const url = config.url || ''
    config.signal = controller.signal
    abortControllerMap.set(url, controller)
    defaultRequestInterceptors(config)
    return config
  },
  (error: AxiosError) => {
    ElMessage.error({ message: error.message, grouping: true })
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)

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