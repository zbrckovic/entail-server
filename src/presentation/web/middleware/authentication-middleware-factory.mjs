import { createError, ErrorName } from '../../../common/error.mjs'

export const AuthenticationMiddlewareFactory = ({ authenticationService }) => {
  const authorizationHeaderPattern = /^Bearer (.+)$/

  return {
    isAuthenticated ({ requireActivatedUser = true }) {
      return async (req, res, next) => {
        try {
          const apiToken = req
            .headers
            ?.authorization
            ?.match(authorizationHeaderPattern)
            ?.[1]

          if (!apiToken) {
            res.status(401).json({ name: ErrorName.NO_TOKEN })
            return
          }

          const decodedToken = await authenticationService.validateAndDecodeJwt(apiToken)

          if (requireActivatedUser && !decodedToken.user.isActivated) {
            res.status(401).json({ name: ErrorName.USER_NOT_ACTIVATED })
            return
          }

          req.user = decodedToken.user
          next()
        } catch (error) {
          const { name } = error
          if (name === 'TokenExpiredError') {
            res.status(401).json({ name: ErrorName.TOKEN_EXPIRED })
            return
          }
          if (name === 'JsonWebTokenError') {
            res.status(401).json({ name: ErrorName.TOKEN_INVALID })
            return
          }
          if (name === ErrorName.INVALID_CREDENTIALS) {
            res.status(403).json({ name })
            return
          }
          next(error)
        }
      }
    }
  }
}
