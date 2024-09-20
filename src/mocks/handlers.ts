import { dictionariesHandlers } from './dictionaries'
import { commonHandlers } from './common'
import { groupsHandlers } from './groups'
import { regionsHandlers } from './regions'
import { rolesHandlers } from './roles'
import { usersHandlers } from './users'
import { privilegesHandlers } from './privileges'
import { operationLogsHandlers } from './operation-logs'
import { accessLogsHandlers } from './access-logs'
import { auditLogsHandlers } from './audit-logs'
import { schedulerLogsHandlers } from './scheduler-logs'
import { filesHandlers } from './files'
import { tablesHandlers } from './tables'
import { scriptsHandlers } from './scripts'

export const handlers = [
  ...commonHandlers,
  ...dictionariesHandlers,
  ...groupsHandlers,
  ...regionsHandlers,
  ...rolesHandlers,
  ...usersHandlers,
  ...privilegesHandlers,
  ...operationLogsHandlers,
  ...accessLogsHandlers,
  ...auditLogsHandlers,
  ...schedulerLogsHandlers,
  ...filesHandlers,
  ...tablesHandlers,
  ...scriptsHandlers
]
