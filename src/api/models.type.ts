export interface User {
  id?: number
  username: string
  email: string
  avatar?: string
  role?: number
  department?: number
  enabled?: boolean
}

export interface Department {
  id?: number
  name: string
  superiorId?: number
  enabled?: boolean
  description?: string
  hasChildren?: boolean
}

export interface TreeNode {
  id?: number
  name: string
  enabled?: boolean
  description?: string
  children?: TreeNode[]
}

export interface Role {
  id?: number
  name: string
  privilege: number | undefined
  enabled?: boolean
  description?: string
}

export interface PrivilegeTreeNode extends TreeNode {
  superiorId?: number
  path: string
  order: number
  component: string
  redirect?: string
  meta: {
    icon: string
  }
  hasChildren?: boolean
  children?: PrivilegeTreeNode[]
}

export interface Privilege {
  id?: number
  name: string
  superiorId?: number
  path: string
  order: number
  component: string
  redirect?: string
  meta: {
    icon: string
  }
  enabled?: boolean
  description?: string
}

export interface Dictionary {
  id?: number
  name: string
  superiorId?: number
  order: number
  enabled?: boolean
  description?: string
  hasChildren?: boolean
  children?: []
}

export interface ActionLog {
  id?: number
  module: string
  method: string
  operator: string
  operation: string
  params: string
  ip: string
  location: string
  status: number
  operateTime: string
}

export interface AccessLog {
  id?: number
  api: string
  method: string
  operator: string
  params: string | null
  ip: string
  location: string
  status: number
  responseTime: number
  responseCode: number
  responseMessage: string
}

export interface AuditLog {
  id?: number
  operator: string
  action: string
  resource: string
  oldValue: string | null
  newValue: string | null
  ip: string
  location: string
  status: number
  actionTime: string
}

export interface SchedulerLog {
  id?: number
  name: string
  method: string
  params: string
  cronExpression: string
  startTime: string
  endTime: string
  status: number
}
