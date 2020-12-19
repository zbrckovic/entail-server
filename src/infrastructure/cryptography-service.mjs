import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const CryptographyService = ({ environment }) => {
  return (
    Object.freeze({
      async createSecureHash (value) {
        return bcrypt.hash(value, environment.bcryptSaltRounds)
      },

      async doesValueMatchSecureHash (value, hash) {
        return bcrypt.compare(value, hash)
      },

      async generateSecureCode () {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(64, (error, buffer) => {
            if (error) {
              reject(error)
            } else {
              resolve(buffer.toString('hex'))
            }
          })
        })
      },

      async generateJwt ({ payload, expiresIn, secret, subject }) {
        return new Promise((resolve, reject) => {
          jwt.sign(
            { payload },
            secret,
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

      async verifyJwt (token, secret) {
        return new Promise((resolve, reject) => {
          jwt.verify(
            token,
            secret,
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
      }
    })
  )
}
