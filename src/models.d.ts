interface AudtiMetadata {
  id?: number
  lastModifiedDate?: Date
}

export interface User extends AudtiMetadata {
  username: string
  email: string
  avatar?: string
  role?: number
  organization?: number
  accountNonLocked: boolean 
  enabled?: boolean
}

export interface Organization extends AudtiMetadata {
  name: string
  superiorId?: number
  enabled?: boolean
  count?: number
  description?: string
  hasChildren?: boolean
}

export interface TreeNode {
  id?: number
  name: string
  children?: TreeNode[]
}

export interface Role extends AudtiMetadata {
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
  hidden?: boolean
  actions?: string[]
  children?: PrivilegeTreeNode[]
}

export interface Privilege extends AudtiMetadata {
  name: string
  superiorId?: number
  path: string
  order: number
  component: string
  redirect?: string
  icon: string
  hidden?: boolean
  actions?: string[]
  count?: number
  hasChildren?: boolean
  enabled?: boolean
  description?: string
}

export interface Dictionary extends AudtiMetadata {
  name: string
  superiorId?: number
  order: number
  enabled?: boolean
  description?: string
  count?: number
  hasChildren?: boolean
  children?: []
}


export interface Region extends AudtiMetadata {
  name: string
  superiorId?: number
  areaCode: number
  postalCode: number
  count?: number
  hasChildren?: boolean
  enabled?: boolean
  description?: string
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
  operationTime: string | null
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
  operationTime: string | null
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
