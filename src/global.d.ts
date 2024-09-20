import type { CSSProperties } from 'vue'
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare interface TableColumnFilter {
    text: string
    value: number | string
  }
}
