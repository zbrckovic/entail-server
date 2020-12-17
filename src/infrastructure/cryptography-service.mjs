import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const CryptographyService = ({ environment }) => ({
  createSecureHash: async value => bcrypt.hash(value, environment.bcryptSaltRounds),
  doesValueMatchSecureHash: async (value, hash) => bcrypt.compare(value, hash),
  generateSecureCode: async () => new Promise((resolve, reject) => {
    crypto.randomBytes(64, (error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer.toString('hex'))
      }
    })
  })
})
