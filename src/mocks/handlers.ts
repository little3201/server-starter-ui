import { dictionariesHandlers } from './dictionaries'
import { commonHandlers } from './common'
import { organizationsHandlers } from './organizations'
import { privilegesHandlers } from './privileges'
import { regionsHandlers } from './regions'
import { rolesHandlers } from './roles'
import { usersHandlers } from './users'
import { operationLogsHandlers } from './operation-logs'
import { accessLogsHandlers } from './access-logs'
import { auditLogsHandlers } from './audit-logs'
import { schedulerLogsHandlers } from './scheduler-logs'

export const handlers = [
  ...commonHandlers,
  ...dictionariesHandlers,
  ...organizationsHandlers,
  ...privilegesHandlers,
  ...regionsHandlers,
  ...rolesHandlers,
  ...usersHandlers,
  ...operationLogsHandlers,
  ...accessLogsHandlers,
  ...auditLogsHandlers,
  ...schedulerLogsHandlers
]
