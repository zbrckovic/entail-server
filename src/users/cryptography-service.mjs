import bcrypt from 'bcrypt'

export const CryptographyService = ({ environment }) => ({
  createPasswordHash: async password => bcrypt.hash(password, environment.bcryptSaltRounds),
  isPasswordCorrect: async (password, hash) => bcrypt.compare(password, hash)
})
