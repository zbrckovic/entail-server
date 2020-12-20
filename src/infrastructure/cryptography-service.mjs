import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const CryptographyService = ({ environment }) => ({
  async createCryptographicHash (value) {
    return bcrypt.hash(value, environment.bcryptSaltRounds)
  },

  // Checks whether `hash` is a cryptographic hash of `value`.
  async isCryptographicHashValid (hash, value) {
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

  async generateJwt ({ key, payload, expiresIn, secret, subject }) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { [key]: payload },
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

  // Checks whether `token` is valid. Returns decoded `token` or throws.
  async validateAndDecodeJwt (token, secret) {
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
