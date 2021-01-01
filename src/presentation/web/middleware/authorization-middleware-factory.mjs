import { ErrorName } from '../../../common/error.mjs'

export const AuthorizationMiddlewareFactory = ({ authorizationService }) => ({
  isAuthorized (...requiredPermissions) {
    return (req, res, next) => {
      const token = req.token

      if (!authorizationService.isAuthorized(token.roles, requiredPermissions)) {
        res.status(403).json({ name: ErrorName.UNAUTHORIZED })
        return
      }

      next()
    }
  }
})
