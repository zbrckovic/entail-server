import stampit from '@stamp/it'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { ErrorName } from '../../../common/error.mjs'

export const AuthenticationService = stampit({
  init({ environment, cryptographyService }) {
    this.environment = environment
    this.cryptographyService = cryptographyService

    this.apiTokenSecret = environment.apiTokenSecret
    this.apiTokenExpiresInSeconds = moment.duration(
      environment.apiTokenExpiresInMinutes, 'minutes'
    ).asSeconds()

    this.authorizationHeaderPattern = /^Bearer (.+)$/
  },
  methods: {
    async generateRefreshToken() {
      return await this.cryptographyService.generateSecureCode()
    },

    async generateApiToken(user) {
      const { id, isActivated, roles } = user

      return new Promise((resolve, reject) => {
        jwt.sign(
          { user: { id, isActivated, roles } },
          this.apiTokenSecret,
          { expiresIn: this.apiTokenExpiresInSeconds, subject: `${id}` },
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

    async verifyToken(token) {
      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          this.apiTokenSecret,
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
    },

    // Creates a middleware for token extraction and verification.
    isAuthenticated() {
      return async (req, res, next) => {
        try {
          const token = req
            .headers
            ?.authorization
            ?.match(this.authorizationHeaderPattern)
            ?.[1]

          if (!token) {
            res.status(401).json({ name: ErrorName.NO_TOKEN })
            return
          }

          const decodedToken = await this.verifyToken(token)
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
  }
})
