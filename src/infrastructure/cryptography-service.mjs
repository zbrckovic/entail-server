import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createError, ErrorName } from '../common/error.mjs'

export const CryptographyService = ({ environment }) => ({
  async createCryptographicHash (value) {
    return bcrypt.hash(value, environment.bcryptSaltRounds)
  },

  // Checks whether `hash` is a cryptographic hash of `value`.
  async isCryptographicHashValid (hash, value) {
    return bcrypt.compare(value, hash)
  },

  async createToken ({ payload = {}, expiresIn, subject }) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        environment.tokenSecret,
        { expiresIn, subject },
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

  // Checks whether `token` is valid. Returns decoded `token` or throws.
  async validateAndDecodeToken (token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        secret,
        {},
        (error, decodedToken) => {
          if (error !== null) {
            if (error.name === 'TokenExpiredError') {
              reject(createError({ name: ErrorName.TOKEN_EXPIRED }))
              return
            }
            if (error.name === 'JsonWebTokenError') {
              reject(createError({ name: ErrorName.TOKEN_INVALID }))
              return
            }
            reject(error)
          } else {
            resolve(decodedToken)
          }
        }
      )
    })
  }
})
