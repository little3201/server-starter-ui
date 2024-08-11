import type { CSSProperties } from 'vue'
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type ComponentRef<T> = InstanceType<T>

  declare interface ContextMenuSchema {
    disabled?: boolean
    divided?: boolean
    icon?: string
    label: string
    command?: (item: ContextMenuSchema) => void
  }

  declare interface ContextMenuExpose {
    elDropdownMenuRef: ComponentRef<typeof ElDropdown>
    tagItem: RouteLocationNormalizedLoaded
  }
}
