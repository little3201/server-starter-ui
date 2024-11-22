import { dayjs } from 'element-plus'
import type { Dictionary } from 'src/models'

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

/**
 * 格式化字典数据
 * @param value 字典值
 * @param rows  字典列表
 * @returns 字典名称
 */
export function formatDictionary(value: number, rows: Dictionary[]): string {
  const dictItem = rows.find(item => item.id === value)
  return dictItem ? dictItem.name : ''
}

/**
 * 数组截取、可展示数组长度
 * @param array 集合、数组
 * @param count 截取树
 * @returns 截取后的数组、集合
 */
export function visibleArray<T extends string | number>(array: T[], count: number): T[] {
  return array.length > count ? array.slice(0, count) : array
}

/**
  将下划线格式转换为驼峰格式，并将每个单词的首字母大写
 * @param word 输入
 * @returns 结果
 */
export function pluralToSingularAndCapitalize(word: string) {
  const camelCase = word.split('_').map((part: string) => {
    const singular = wordToSingular(part)
    return singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase()
  }).join('')

  return camelCase
}

/**
 * 复数到单数的转换规则
 * @param word 复数
 * @returns 单数
 */
export function wordToSingular(word: string) {
  const pluralRules = [
    { regex: /ies$/, replacement: 'y' },
    { regex: /ves$/, replacement: 'f' },
    { regex: /s$/, replacement: '' }
  ]

  // 将单词转换为单数
  for (const rule of pluralRules) {
    if (rule.regex.test(word)) {
      return word.replace(rule.regex, rule.replacement)
    }
  }
  return word
}
