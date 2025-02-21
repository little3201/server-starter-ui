import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from 'stores/user-store'
import { i18n } from 'boot/i18n'
import type { ComposerTranslation } from 'vue-i18n'

const { t } = i18n.global as { t: ComposerTranslation }

const abortControllerMap: Map<string, AbortController> = new Map()

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ASE_API || '/api',
  timeout: 5000,
  withCredentials: true
})

// 请求拦截器
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    // 创建 AbortController 实例
    const controller = new AbortController()
    const uniqueKey = `${config.method}:${config.url}`
    config.signal = controller.signal
    abortControllerMap.set(uniqueKey, controller)

    removeEmptyParamsFromGetRequest(config)
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
    const status = error.response?.status
    switch (status) {
      case 403:
        ElMessage.error({ message: t('forbidden'), grouping: true })
        break
      case 404:
        ElMessage.error({ message: t('notFound'), grouping: true })
        break
      case 500:
        ElMessage.error({ message: t('serverError'), grouping: true })
        break
      default:
        ElMessage.error({ message: t('error'), grouping: true })
    }
    return Promise.reject(error)
  }
)

/**
 * 拦截并处理axios的请求配置，以便在GET请求时移除空字符串、null和undefined的参数。
 * @param config - axios请求配置对象
 * @returns 修改后的axios请求配置对象
 */
const removeEmptyParamsFromGetRequest = (config: InternalAxiosRequestConfig) => {
  // 如果请求方法是 GET 且存在参数
  if (config.method === 'get' && config.params) {
    // 将参数对象转换为键值对数组，过滤掉值为 undefined, null 或 空字符串的参数
    const params = Object.entries(config.params)
      .filter((entry): entry is [string, string] => {
        const value = entry[1]
        return value !== undefined && value !== null && value !== ''
      })
      // 对剩余的参数进行编码并转换为查询字符串格式
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&') // 使用 & 符号连接各个参数

    // 将过滤后的查询字符串附加到 URL 上
    config.url = `${config.url}?${params}`
    config.params = {}
  }
  return config
}

const cancelRequest = (url: string | string[], method: string = 'get') => {
  const urlList = Array.isArray(url) ? url : [url]
  for (const _url of urlList) {
    const uniqueKey = `${method}:${_url}`
    if (abortControllerMap.has(uniqueKey)) {
      abortControllerMap.get(uniqueKey)?.abort()
      abortControllerMap.delete(uniqueKey)
    }
  }
}

const cancelAllRequest = () => {
  abortControllerMap.forEach(controller => controller.abort())
  abortControllerMap.clear()
}

export { api, cancelRequest, cancelAllRequest }
