import { createError, ErrorName } from '../common/error.mjs'
import { TokenType } from '../infrastructure/token-type.mjs'

// Account management for users.
export const AccountService = ({
  authenticationService,
  usersRepository,
  emailService,
  cryptographyService,
  withTransaction
}) => ({
  async requestEmailVerification (userId) {
    const user = await authenticationService.getUserById(userId)

    if (user.isEmailVerified) {
      throw createError({ name: ErrorName.EMAIL_ALREADY_VERIFIED })
    }

    const emailVerificationToken = await authenticationService.createEmailVerificationToken(user)
    await emailService.sendEmailVerificationToken(emailVerificationToken, user.email)
  },

  async verifyEmail (userId, token) {
    await withTransaction(async () => {
      const user = await authenticationService.getUserById(userId)

      if (user.isEmailVerified) {
        throw createError({ name: ErrorName.EMAIL_ALREADY_VERIFIED })
      }

      const decodedToken =
        await authenticationService.validateAndDecodeEmailVerificationToken(token)

      if (decodedToken.sub !== user.id) {
        throw createError({
          name: ErrorName.TOKEN_INVALID,
          extra: { tokenType: TokenType.EMAIL_VERIFICATION }
        })
      }

      await usersRepository.updateUser({ ...user, isEmailVerified: true })
    })
  },

  async changePasswordWithOldPassword ({ userId, oldPassword, newPassword }) {
    await withTransaction(async () => {
      const user = await authenticationService.getUserById(userId)

      const isPasswordValid = await cryptographyService.isCryptographicHashValid(
        user.passwordHash,
        oldPassword
      )

      if (!isPasswordValid) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      const passwordHash = await cryptographyService.createCryptographicHash(newPassword)
      await usersRepository.updateUser({ ...user, passwordHash })
    })
  },

  async refreshApiToken (userId) {
    const user = await authenticationService.getUserById(userId)
    return await authenticationService.createApiToken(user)
  }
})
