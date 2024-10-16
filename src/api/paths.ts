// 接口请求路径
export const SERVER_URL = {
  // hypervisor
  USER: '/users', // 用户
  ROLE: '/roles', // 角色
  PRIVILEGE: '/privileges', // 权限
  GROUP: '/groups', // 分组
  DICTIONARY: '/dictionaries', // 字典
  ACCESS_LOG: '/access-logs', // 访问日志
  AUDIT_LOG: '/audit-logs', // 审计日志
  OPERATION_LOG: '/operation-logs', // 操作日志
  SCHEDULER_LOG: '/scheduler-logs', // 调度日志
  FILE: '/files', // 文件
  REGION: '/regions', // 行政区划

  // authentication
  LOGIN: '/token', // 登录
  LOGOUT: '/logout' // 退出
}
