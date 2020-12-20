import { ErrorName } from '../../../common/error.mjs'

export const AuthenticationMiddlewareFactory = ({ authenticationService }) => ({
  isAuthenticated () {
    return async (req, res, next) => {
      try {
        const token = req.cookies.token

        if (!token) {
          res.status(401).json({ name: ErrorName.NO_TOKEN })
          return
        }

        req.token = await authenticationService.validateAndDecodeApiToken(token)
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
})
