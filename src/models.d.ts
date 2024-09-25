interface AudtiMetadata {
  id?: number
  lastModifiedDate?: Date
}

export interface User extends AudtiMetadata {
  username: string
  email: string
  avatar?: string
  roleId?: number | null
  groupId?: number | null
  accountNonLocked?: boolean
  accountExpiresAt?: Date
  credentialsExpiresAt?: Date
  enabled?: boolean
}

export interface Group extends AudtiMetadata {
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
  enabled: boolean
  description?: string
  count?: number
  hasChildren?: boolean
}

export interface Region extends AudtiMetadata {
  name: string
  superiorId?: number
  areaCode: number | null
  postalCode: number | null
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
  operation: string
  content: string
  operator: string
  ip: string
  location: string
  referer?: string | null
  sessionId?: string | null
  os?: string | null
  deviceType?: string | null
  userAgent?: string | null
  browser?: string | null
  statusCode: number | null
  operatedTime: string | null
}

export interface AccessLog extends AudtiMetadata {
  url: string
  httpMethod: string | null
  operator: string
  params?: string | null
  body?: string | null
  ip: string
  location: string
  responseTimes: number
  statusCode: number | null
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