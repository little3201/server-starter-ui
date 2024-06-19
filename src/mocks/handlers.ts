import { dictionariesHandlers } from './dictionaries'
import { commonHandlers } from './common'
import { departmentsHandlers } from './departments'
import { privilegesHandlers } from './privileges'
import { rolesHandlers } from './roles'
import { usersHandlers } from './users'
import { actionLogsHandlers } from './action-logs'
import { accessLogsHandlers } from './access-logs'
import { auditLogsHandlers } from './audit-logs'
import { schedulerLogsHandlers } from './scheduler-logs'

export const handlers = [
  ...commonHandlers,
  ...dictionariesHandlers,
  ...departmentsHandlers,
  ...privilegesHandlers,
  ...rolesHandlers,
  ...usersHandlers,
  ...actionLogsHandlers,
  ...accessLogsHandlers,
  ...auditLogsHandlers,
  ...schedulerLogsHandlers,
]
