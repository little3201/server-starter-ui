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
  category: string
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

export interface Log {
  id?: number
  title: string
  content: string
}
