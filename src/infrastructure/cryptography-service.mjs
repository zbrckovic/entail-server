import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const CryptographyService = ({ environment }) => ({
  createPasswordHash: async password => bcrypt.hash(password, environment.bcryptSaltRounds),
  isPasswordCorrect: async (password, hash) => bcrypt.compare(password, hash),
  generateActivationCode: async () => new Promise((resolve, reject) => {
    crypto.randomBytes(64, (error, buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(buffer.toString('hex'))
      }
    })
  })
})
