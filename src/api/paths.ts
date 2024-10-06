// 服务匹配前缀
const SERVER_PRE = {
  HYPERVISOR: '',
  ASSETS: '',
  EXPLOITER: ''
}

// 接口请求路径
export const SERVER_URL = {
  // hypervisor
  USER: SERVER_PRE.HYPERVISOR.concat('/users'), // 用户
  ROLE: SERVER_PRE.HYPERVISOR.concat('/roles'), // 角色
  PRIVILEGE: SERVER_PRE.HYPERVISOR.concat('/privileges'), // 权限
  GROUP: SERVER_PRE.HYPERVISOR.concat('/groups'), // 分组
  DICTIONARY: SERVER_PRE.HYPERVISOR.concat('/dictionaries'), // 字典
  ACCESS_LOG: SERVER_PRE.HYPERVISOR.concat('/access-logs'), // 访问日志
  AUDIT_LOG: SERVER_PRE.HYPERVISOR.concat('/audit-logs'), // 审计日志
  OPERATION_LOG: SERVER_PRE.HYPERVISOR.concat('/operation-logs'), // 操作日志
  SCHEDULER_LOG: SERVER_PRE.HYPERVISOR.concat('/scheduler-logs'), // 调度日志

  // assets
  POST: SERVER_PRE.ASSETS.concat('/posts'), // 帖子
  CATEGORY: SERVER_PRE.ASSETS.concat('/categories'), // 类别
  STATISTICS: SERVER_PRE.ASSETS.concat('/statistics'), // 统计
  COMMENT: SERVER_PRE.ASSETS.concat('/comments'), // 评论
  REGION: SERVER_PRE.ASSETS.concat('/regions'), // 行政区划
  FILE: SERVER_PRE.ASSETS.concat('/files'), // 文件

  // exploiter
  TABLE: SERVER_PRE.EXPLOITER.concat('/tables'), // 表
  SCRIPT: SERVER_PRE.EXPLOITER.concat('/scripts'), // 脚本
}
