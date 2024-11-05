import { dayjs } from 'element-plus'

/**
 * Resolve a child path relative to a parent path
 * @param {string} parentPath - The parent path
 * @param {string} path - The child path
 * @returns {string} - The resolved path
 */
export function pathResolve(parentPath: string, path: string): string {
  if (!path) return ''
  const childPath = path.startsWith('/') ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}

/**
 * Check if a value matches a specific type
 * @param {unknown} val - The value to check
 * @param {string} type - The type to match
 * @returns {boolean} - True if the value matches the type, otherwise false
 */
function is(val: unknown, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

/**
 * Check if a value is a string
 * @param {unknown} val - The value to check
 * @returns {boolean} - True if the value is a string, otherwise false
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * Check if a value is a number
 * @param {unknown} val - The value to check
 * @returns {boolean} - True if the value is a number, otherwise false
 */
export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number')
}

/**
 * Compare the target date with the current date and return a status
 * @param {string} target - The target date
 * @returns {string} - The status ('success', 'warning', 'danger')
 */
export function calculate(target: string): string {
  const now = new Date()
  const targetDate = new Date(target)
  const diff = dayjs(targetDate).diff(now, 'days')
  if (diff > 7) {
    return 'success'
  } else {
    const diffSec = dayjs(targetDate).diff(now, 'seconds')
    return diffSec > 0 ? 'warning' : 'danger'
  }
}

/**
 * Format a duration given in milliseconds into a human-readable string
 * @param {number} milliseconds - The duration in milliseconds
 * @returns {string} - The formatted duration
 */
export function formatDuration(milliseconds: number): string {
  const timeUnits = [
    { unit: 'h', factor: 3600000 },
    { unit: 'min', factor: 60000 },
    { unit: 's', factor: 1000 },
    { unit: 'ms', factor: 1 }
  ]
  for (const { unit, factor } of timeUnits) {
    if (milliseconds >= factor) {
      const value = Math.floor(milliseconds / factor)
      return `${value}${unit}`
    }
  }
  return '0ms'
}

/**
 * Format a file size given in bytes into a human-readable string
 * @param {number} size - The file size in bytes
 * @returns {string} - The formatted file size
 */
export function formatFileSize(size: number): string {
  if (isNaN(size) || size <= 0) return '-'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)}${units[index]}`
}

export function visibleArray(array: string[], count: number): string[] {
  return array.length > count ? array.slice(0, count) : array
}

export const actions: { [key: string]: 'primary' | 'success' | 'info' | 'warning' | 'danger' } = {
  add: 'primary',
  edit: 'primary',
  upload: 'primary',

  import: 'warning',

  remove: 'danger',
  clear: 'danger',

  export: 'success',
  relation: 'success',
  config: 'success',
  download: 'success',

  preview: 'info',
  detail: 'info'
}
