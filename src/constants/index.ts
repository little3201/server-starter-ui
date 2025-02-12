// 接口请求路径
export const SERVER_URL = {
  // hypervisor
  USER: '/users', // 用户
  ROLE: '/roles', // 角色
  PRIVILEGE: '/hypervisor/privileges', // 权限
  GROUP: '/groups', // 分组
  DICTIONARY: '/dictionaries', // 字典
  ACCESS_LOG: '/access-logs', // 访问日志
  AUDIT_LOG: '/audit-logs', // 审计日志
  OPERATION_LOG: '/operation-logs', // 操作日志
  SCHEDULER_LOG: '/scheduler-logs', // 调度日志
  FILE: '/files', // 文件
  REGION: '/regions', // 行政区划
  MESSAGE: '/messages', // 消息
  USERINFO: '/userinfo', // 用户信息

  // authentication
  LOGIN: '/login', // 登录
  LOGOUT: '/logout', // 退出
  TOKEN: '/oauth2/token', // token

  // exploiters
  SCRIPT: '/scripts', // 脚本
  SCHEMA: '/schemas', // 表配置
  TEMPLATE: '/templates', // 模板
  DB: '/db' // 表
}

// 按钮对应tag类型
export const actions: { [key: string]: 'primary' | 'success' | 'info' | 'warning' | 'danger' } = {
  create: 'primary',
  modify: 'primary',

  import: 'warning',
  export: 'success',

  remove: 'danger',
  clear: 'danger',

  relation: 'success',
  config: 'success',

  upload: 'primary',
  download: 'success',

  preview: 'info',
  detail: 'info',

  login: 'success',
  logout: 'primary'
}

// http method对应tag类型
export const httpMethods: { [key: string]: string } = {
  GET: 'success',
  POST: 'warning',
  PUT: 'primary',
  PATCH: 'primary',
  DELETE: 'danger'
}
