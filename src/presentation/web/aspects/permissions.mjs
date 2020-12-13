import { Role } from '../../../domain/users/role.mjs'

export const Permission = {
  USER_MANAGEMENT: 'USER_MANAGEMENT'
}

// To each role we assign a set of permissions, and also optionally a set of inferior roles
// whose permissions it will borrow.
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
  }
}
