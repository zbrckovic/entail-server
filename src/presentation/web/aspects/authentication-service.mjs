import jwt from 'jsonwebtoken'
import moment from 'moment'
import { ErrorName } from '../../../common/error.mjs'

export const AuthenticationService = ({ environment, cryptographyService }) => {
  const apiTokenSecret = environment.apiTokenSecret
  const apiTokenExpiresInSeconds = moment.duration(
    environment.apiTokenExpiresInMinutes, 'minutes'
  ).asSeconds()

  const authorizationHeaderPattern = /^Bearer (.+)$/

  const result = Object.freeze({
    async generateRefreshToken () {
      return await cryptographyService.generateSecureCode()
    },

    async generateApiToken (user) {
      const { id, isActivated, roles } = user

      return new Promise((resolve, reject) => {
        jwt.sign(
          { user: { id, isActivated, roles } },
          apiTokenSecret,
          { expiresIn: apiTokenExpiresInSeconds, subject: `${id}` },
          (error, token) => {
            if (error !== null) {
              reject(error)
            } else {
              resolve(token)
            }
          }
        )
      })
    },

    // Creates a middleware for token extraction and verification.
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

          const decodedToken = await verifyToken(token)
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

  const verifyToken = async token => (
    new Promise((resolve, reject) => {
      jwt.verify(
        token,
        apiTokenSecret,
        {},
        (error, decodedToken) => {
          if (error !== null) {
            reject(error)
          } else {
            resolve(decodedToken)
          }
        }
      )
    })
  )

  return result
}
