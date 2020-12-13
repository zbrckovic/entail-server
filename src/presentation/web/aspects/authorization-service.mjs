import stampit from '@stamp/it'
import { PermissionsAssignments } from './permissions.mjs'
import { ErrorName } from '../../../common/error.mjs'

export const AuthorizationService = stampit({
  methods: {
    // Creates a middleware which checks whether previously authenticated user has all required
    // permissions. If not, returns an error response.
    isAuthorized (...requiredPermissions) {
      requiredPermissions = new Set(requiredPermissions)

      return (req, res, next) => {
        const user = req.user

        const permissions = getPermissionsForRoles(...user.roles)

        const isAuthorized = [...requiredPermissions].every(requiredPermission => (
          permissions.has(requiredPermission)
        ))

        if (!isAuthorized) {
          res.status(403).json({ name: ErrorName.UNAUTHORIZED })
          return
        }

        next()
      }
    }
  }
})

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
