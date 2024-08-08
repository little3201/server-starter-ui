import type { CSSProperties } from 'vue'
import { RawAxiosRequestHeaders } from 'axios'
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type ComponentRef<T> = InstanceType<T>

  declare interface LocaleType {
    lang: string
    name?: string
  }

  declare interface RouteMetaCustom extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    icon?: string
    noCache?: boolean
    noTagsView?: boolean
    permission?: string[]
  }

  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  declare interface AppCustomRouteRecordRaw
    extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
  }

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
