import { ErrorName } from '../../../common/error.mjs'

export const AuthorizationMiddlewareFactory = ({ authorizationService }) => ({
  isAuthorized (...requiredPermissions) {
    return (req, res, next) => {
      const user = req.user

      if (!authorizationService.isAuthorized(user.roles, requiredPermissions)) {
        res.status(403).json({ name: ErrorName.UNAUTHORIZED })
        return
      }

      next()
    }
  }
})
