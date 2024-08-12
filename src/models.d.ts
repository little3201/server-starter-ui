export interface User {
  id?: number
  username: string
  email: string
  avatar?: string
  role?: number
  organization?: number
  enabled?: boolean
}

export interface Organization {
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
  children?: TreeNode[]
}

export interface Role {
  id?: number
  name: string
  privileges: number | undefined
  enabled?: boolean
  description?: string
}

export interface PrivilegeTreeNode extends TreeNode {
  path: string
  component: string
  redirect?: string
  icon: string
  actions?: string[]
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
  icon: string
  hidden?: boolean
  actions?: string[]
  count: number
  hasChildren?: boolean
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

export interface OperationLog {
  id?: number
  module: string
  method: string
  operator: string
  operation: string
  params: string | null
  ip: string
  location: string
  status: number | null
  operateTime: string | null
}

export interface AccessLog {
  id?: number
  api: string
  method: string
  operator: string
  params: string | null
  ip: string
  location: string
  status: number | null
  responseTime: number | null
  responseCode: number | null
  responseMessage: string | null
}

export interface AuditLog {
  id?: number
  operator: string
  operation: string
  resource: string
  oldValue: string | null
  newValue: string | null
  ip: string
  location: string
  status: number | null
  actionTime: string | null
}

export interface SchedulerLog {
  id?: number
  name: string
  method: string
  params: string
  cronExpression: string
  startTime: string
  endTime: string
  status: number | null
}
