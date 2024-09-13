interface AudtiMetadata {
  id?: number
  lastModifiedDate?: Date
}

export interface User extends AudtiMetadata {
  username: string
  email: string
  avatar?: string
  role?: number | null
  organization?: number | null
  accountNonLocked?: boolean
  accountExpiresAt?: Date
  credentialsExpiresAt?: Date
  enabled?: boolean
}

export interface Organization extends AudtiMetadata {
  name: string
  superiorId?: number
  enabled: boolean
  description?: string
}

export interface Role extends AudtiMetadata {
  name: string
  privileges: number | undefined
  enabled?: boolean
  description?: string
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

export interface TreeNode {
  id?: number
  name: string
  children?: TreeNode[]
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

export interface OperationLog extends AudtiMetadata {
  module: string
  method: string
  operator: string
  operation: string
  params: string | null
  ip: string
  location: string
  status: number | null
  operatedTime: string | null
}

export interface AccessLog extends AudtiMetadata {
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

export interface AuditLog extends AudtiMetadata {
  operator: string
  operation: string
  resource: string
  oldValue: string | null
  newValue: string | null
  ip: string
  location: string
  status: number | null
  operatedTime: string | null
}

export interface SchedulerLog extends AudtiMetadata {
  name: string
  method: string
  params: string
  cronExpression: string
  executedTime: number
  status: number | null
}

export interface File extends AudtiMetadata {
  name: string
  type: string
  size: number
}

export interface Table extends AudtiMetadata {
  name: string
  comment: string
  description: string
}

export interface Column extends AudtiMetadata {
  name: string
  type: string
  length: number
  nullable: boolean
  unique: boolean
  comment: string
  description: string
}

export interface Code extends AudtiMetadata {
  name: string
  content: string
}

export interface Script extends AudtiMetadata {
  name: string
  icon: string
  version: string
  description: string
}