import { dictionariesHandlers } from './dictionaries'
import { commonHandlers } from './common'
import { organizationsHandlers } from './organizations'
import { privilegesHandlers } from './privileges'
import { rolesHandlers } from './roles'
import { usersHandlers } from './users'
import { operationLogsHandlers } from './operations-logs'
import { accessLogsHandlers } from './access-logs'
import { auditLogsHandlers } from './audit-logs'
import { schedulerLogsHandlers } from './scheduler-logs'

export const handlers = [
  ...commonHandlers,
  ...dictionariesHandlers,
  ...organizationsHandlers,
  ...privilegesHandlers,
  ...rolesHandlers,
  ...usersHandlers,
  ...operationLogsHandlers,
  ...accessLogsHandlers,
  ...auditLogsHandlers,
  ...schedulerLogsHandlers
]
