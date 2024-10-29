import { dayjs } from 'element-plus'

export const pathResolve = (parentPath: string, path: string) => {
  if (!path) return ''
  const childPath = path.startsWith('/') ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`
}

export const isString = (val: unknown): val is string => {
  return is(val, 'String')
}

export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number')
}

/**
 * 对比当前时间，大于7天返回success，小于7天大于当前，返回warning，否则返回danger
 * @param target targe
 * @returns type
 */
export function calculate(target: string) {
  const now = new Date()
  const targetDate = new Date(target)
  // 失效时间是否小于7天
  const diff = dayjs(targetDate).diff(now, 'days')
  if (diff > 7) {
    return 'success'
  } else {
    // 是否失效
    const diffSec = dayjs(targetDate).diff(now, 'seconds')
    if (diffSec > 0) {
      return 'warning'
    } else {
      return 'danger'
    }
  }
}

export const formatDuration = (milliseconds: number) => {
  const timeUnits = [
    { unit: 'h', factor: 3600000 }, // 1小时 = 3600000毫秒
    { unit: 'min', factor: 60000 }, // 1分钟 = 60000毫秒
    { unit: 's', factor: 1000 }, // 1秒 = 1000毫秒
    { unit: 'ms', factor: 1 } // 毫秒
  ]

  for (const { unit, factor } of timeUnits) {
    if (milliseconds >= factor) {
      const value = Math.floor(milliseconds / factor)
      return `${value}${unit}`
    }
  }

  return '0ms' // 处理0毫秒的情况
}

export const formatFileSize = (size: number) => {
  if (isNaN(size) || size <= 0) return '-'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }

  return `${size.toFixed(2)}${units[index]}`
}
