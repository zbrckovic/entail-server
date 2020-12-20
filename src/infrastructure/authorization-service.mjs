import { PermissionsAssignments } from './permissions.mjs'

export const AuthorizationService = () => {
  const result = {
    // Checks whether every required permission is owned by at least one role.
    isAuthorized (roles, requiredPermissions) {
      const requiredPermissionsSet = new Set(requiredPermissions)
      const permissions = getPermissionsForRoles(roles)
      return requiredPermissionsSet.every(requiredPermission => permissions.has(requiredPermission))
    }
  }

  const getPermissionsForRoles = (...roles) => {
    const result = new Set()

    roles.forEach(role => {
      getPermissionsForRole(role).forEach(permission => {
        result.add(permission)
      })
    })

    return result
  }

  const getPermissionsForRole = role => {
    const result = new Set()

    const { superiorTo, permissions } = PermissionsAssignments[role]

    permissions.forEach(permission => { result.add(permission) })

    superiorTo.forEach(role => {
      getPermissionsForRole(role).forEach(permissionForRole => {
        result.add(permissionForRole)
      })
    })

    return result
  }

  return result
}
