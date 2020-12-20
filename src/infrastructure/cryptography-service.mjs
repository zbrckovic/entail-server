import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const CryptographyService = ({ environment }) => ({
  async createCryptographicHash (value) {
    return bcrypt.hash(value, environment.bcryptSaltRounds)
  },

  // Returns boolean.
  async verifyCryptographicHash (value, hash) {
    return bcrypt.compare(value, hash)
  },

  async generateCryptographicRandomBytes (size = 64) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(size, (error, buffer) => {
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

  // Checks whether `token` is encoded with `secret` and is still valid. Returns decoded `token`
  // or throws.
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
