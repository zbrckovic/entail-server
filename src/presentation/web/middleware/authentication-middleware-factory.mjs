import { ErrorName } from '../../../common/error.mjs'

export const AuthenticationMiddlewareFactory = ({ authenticationService }) => {
  const authorizationHeaderPattern = /^Bearer (.+)$/

  return Object.freeze({
    isAuthenticated () {
      return async (req, res, next) => {
        try {
          const token = req
            .headers
            ?.authorization
            ?.match(authorizationHeaderPattern)
            ?.[1]

          if (!token) {
            res.status(401).json({ name: ErrorName.NO_TOKEN })
            return
          }

          const decodedToken = await authenticationService.verifyToken(token)
          req.user = decodedToken.user
          next()
        } catch (error) {
          const { name } = error
          if (name === 'TokenExpiredError') {
            res.status(401).json({ name: ErrorName.TOKEN_EXPIRED })
          } else if (name === 'JsonWebTokenError') {
            res.status(401).json({ name: ErrorName.TOKEN_INVALID })
          } else {
            next(error)
          }
        }
      }
    }
  })
}
