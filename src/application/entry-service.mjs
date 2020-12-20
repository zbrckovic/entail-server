import { createError, ErrorName } from '../common/error.mjs'
import { Role, User } from '../domain/user.mjs'

export const EntryService = ({
  usersRepository,
  cryptographyService,
  emailService,
  authenticationService
}) => {
  const result = {
    async register ({ email, password }) {
      const passwordHash = await cryptographyService.createCryptographicHash(password)
      const user = User({ email, passwordHash, roles: [Role.REGULAR] })
      await usersRepository.createUser(user)
      await createAndSendEmailVerificationToken(user)

      return await authenticationService.createApiToken(user)
    },

    async login ({ email, password }) {
      const user = await authenticationService.verifyCredentialsAndGetUser({ email, password })
      return await authenticationService.createApiToken(user)
    },

    async createApiToken (userId) {
      const user = await authenticationService.getUserById(userId)
      return await authenticationService.createApiToken(user)
    },

    async createEmailVerificationToken (userId) {
      const user = await authenticationService.getUserById(userId)

      if (user.isEmailVerified) {
        throw createError({ name: ErrorName.EMAIL_ALREADY_VERIFIED })
      }

      await createAndSendEmailVerificationToken(user)
    },

    async verifyEmail (userId, emailVerificationToken) {
      const user = await authenticationService.getUserById(userId)
      await authenticationService.validateAndDecodeEmailVerificationToken(emailVerificationToken)
      await usersRepository.updateUser({ ...user, isEmailVerified: true })
    }
  }

  const createAndSendEmailVerificationToken = async user => {
    const emailVerificationToken = await authenticationService.createEmailVerificationToken(user)
    await emailService.sendEmailVerificationToken(emailVerificationToken, user.email)
  }

  return result
}
