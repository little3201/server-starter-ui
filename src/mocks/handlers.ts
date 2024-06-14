import { dictionariesHandlers } from './dictionaries'
import { commonHandlers } from './common'
import { departmentsHandlers } from './departments'
import { privilegesHandlers } from './privileges'
import { rolesHandlers } from './roles'
import { usersHandlers } from './users'
import { logsHandlers } from './logs'

export const handlers = [
  ...commonHandlers,
  ...dictionariesHandlers,
  ...departmentsHandlers,
  ...privilegesHandlers,
  ...rolesHandlers,
  ...usersHandlers,
  ...logsHandlers
]
