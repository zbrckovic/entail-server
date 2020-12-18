import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const CryptographyService = ({ environment }) => (
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
    }
  })
)
