interface AudtiMetadata {
  id: number | undefined
  lastModifiedDate?: Date
}

export interface Pagination {
  page: number,
  size: number,
  sortBy?: string,
  descending?: boolean
}

export interface User extends AudtiMetadata {
  username: string
  givenName: string
  familyName: string
  middleName?: string
  email: string
  avatar?: string
  accountNonLocked?: boolean
  accountExpiresAt?: Date
  credentialsExpiresAt?: Date
  enabled?: boolean
}

export interface UserPrivileges {
  id: number
  username: string
  privilegeId: number
  actions?: string[]
}

export interface Group extends AudtiMetadata {
  name: string
  superiorId?: number
  principal?: string
  members?: string[]
  enabled?: boolean
  description?: string
}

export interface GroupMembers {
  id: number
  groupId: number
  username: string
}

export interface GroupPrivileges {
  id: number
  groupId: number
  privilegeId: number
  actions?: string[]
}

export interface Role extends AudtiMetadata {
  name: string
  members?: string[]
  enabled?: boolean
  description?: string
}

export interface RoleMembers {
  id: number
  roleId: number
  username: string
}

export interface RolePrivileges {
  id: number
  roleId: number
  privilegeId: number
  actions?: string[]
}

export interface Privilege extends AudtiMetadata {
  name: string
  superiorId?: number
  path: string
  component: string
  redirect?: string
  icon: string
  actions?: string[]
  count?: number
  hasChildren?: boolean
  enabled?: boolean
  description?: string
}

export interface Dictionary extends AudtiMetadata {
  name: string
  superiorId?: number
  enabled?: boolean
  description?: string
  count?: number
  hasChildren?: boolean
}

export interface Region extends AudtiMetadata {
  name: string
  superiorId?: number
  areaCode?: number
  postalCode?: number
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
  meta: {
    path: string
    component: string
    redirect?: string
    icon: string
    actions?: string[]
  },
  children?: PrivilegeTreeNode[]
}

export interface TemplateTreeNode extends TreeNode {
  content?: string
  suffix?: string
  children?: TemplateTreeNode[]
}

export interface OperationLog extends AudtiMetadata {
  operation: string
  content: string
  ip: string
  location: string
  referer?: string
  sessionId?: string
  os?: string
  deviceType?: string
  userAgent?: string
  browser?: string
  statusCode?: number
  operatedTimes?: number
}

export interface AccessLog extends AudtiMetadata {
  url: string
  httpMethod: string
  operator?: string
  params?: string
  body?: string
  ip: string
  location: string
  responseTimes?: number
  statusCode?: number
  responseMessage?: string
}

export interface AuditLog extends AudtiMetadata {
  operator: string
  operation: string
  resource: string
  oldValue?: string
  newValue?: string
  ip: string
  location: string
  statusCode?: number
  operatedTimes?: number
}

export interface SchedulerLog extends AudtiMetadata {
  name: string
  startTime?: Date
  executedTimes?: number
  nextExecuteTime?: Date
  status?: number
  record?: string
}

export interface FileRecord extends AudtiMetadata {
  name: string
  mimeType: string
  size: number
}

export interface Schema extends AudtiMetadata {
  name: string
  prefix?: string
  packagePath: string
  enabled?: boolean
  templates: number[]
}

export interface Field extends AudtiMetadata {
  name: string
  dataType: string
  length: number
  fieldType: string
  formType: string
  nullable: boolean
  queryable: boolean
  queryType: string | undefined
  editable: boolean
  sortable: boolean
  description: string
}

export interface Template extends AudtiMetadata {
  name: string
  suffix: string
  content: string
  type?: number
  version: string
  enabled?: boolean
}

export interface Script extends AudtiMetadata {
  name: string
  type: number | undefined
  icon: string
  version: string
  content: string
  description: string
}

export interface Database extends AudtiMetadata {
  name: string
  type: number | undefined
  host: string
  port: number | undefined
  username: string
  password?: string
  enabled?: boolean
  tables?: string[]
}