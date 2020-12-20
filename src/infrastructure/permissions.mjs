import { Role } from '../domain/user.mjs'

export const Permission = {
  USER_MANAGEMENT: 'USER_MANAGEMENT'
}

// A set of permissions is assigned to each role. Each role also optionally has a set of inferior
// roles whose permissions it assumes indirectly.
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
