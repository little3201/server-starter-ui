import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from 'src/router'
import { i18n } from 'boot/i18n'

const { t } = i18n.global

const abortControllerMap: Map<string, AbortController> = new Map()

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_API,
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')

    // 创建 AbortController 实例
    const controller = new AbortController()
    const uniqueKey = `${config.method}:${config.url}`
    config.signal = controller.signal
    abortControllerMap.set(uniqueKey, controller)

    defaultRequestInterceptors(config)
    return config
  },
  (error: AxiosError) => {
    ElMessage.error({ message: error.message, grouping: true })
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (res: AxiosResponse) => {
    const uniqueKey = `${res.config.method}:${res.config.url}`
    abortControllerMap.delete(uniqueKey)
    return res
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      router.replace('/login')
      ElMessage.error({ message: t('unauthorized'), grouping: true })
    } else if (error.response?.status === 404) {
      ElMessage.error({ message: t('notFound'), grouping: true })
    } else if (error.response?.status === 500) {
      ElMessage.error({ message: t('serverError'), grouping: true })
    } else {
      ElMessage.error({ message: t('default'), grouping: true })
    }
    return Promise.reject(error)
  }
)

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    Object.keys(config.params).forEach((key) => {
      if (config.params[key] !== undefined && config.params[key] !== null && config.params[key] !== '') {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    })
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const cancelRequest = (url: string | string[], method: string = 'get') => {
  const urlList = Array.isArray(url) ? url : [url]
  for (const _url of urlList) {
    const uniqueKey = `${method}:${_url}`
    abortControllerMap.get(uniqueKey)?.abort()
    abortControllerMap.delete(uniqueKey)
  }
}

const cancelAllRequest = () => {
  for (const controller of abortControllerMap.values()) {
    controller.abort()
  }
  abortControllerMap.clear()
}

export { api, cancelRequest, cancelAllRequest }
