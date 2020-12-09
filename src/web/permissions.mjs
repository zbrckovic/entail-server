import { Role } from '../core/users/role.mjs'

export const Permission = {
  USER_MANAGEMENT: 'USER_MANAGEMENT'
}

export const PermissionsAssignments = {
  [Role.SUPER_ADMIN]: {
    superiorTo: [Role.ADMIN],
    permissions: []
  },
  [Role.ADMIN]: {
    superiorTo: [Role.REGULAR],
    permissions: [Permission.USER_MANAGEMENT]
  },
  [Role.REGULAR]: {
    superiorTo: [],
    permissions: []
  },
}
