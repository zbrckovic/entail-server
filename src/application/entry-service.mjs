import { Role, User } from '../domain/user.mjs'
import { createError, ErrorName } from '../common/error.mjs'
import { TokenType } from '../infrastructure/token-type.mjs'

// Entry point for non-authenticated users.
export const EntryService = ({
  usersRepository,
  cryptographyService,
  emailService,
  authenticationService,
  withTransaction
}) => ({
  async register ({ email, password }) {
    const passwordHash = await cryptographyService.createCryptographicHash(password)
    const user = User({ email, passwordHash, roles: [Role.REGULAR] })
    await usersRepository.createUser(user)

    const emailVerificationToken = await authenticationService.createEmailVerificationToken(user)
    await emailService.sendEmailVerificationToken(emailVerificationToken, user.email)

    return await authenticationService.createApiToken(user)
  },

  async login ({ email, password }) {
    const user = await authenticationService.getUserByEmail(email)

    const isPasswordValid = await cryptographyService.isCryptographicHashValid(
      user.passwordHash,
      password
    )

    if (!isPasswordValid) { throw createError({ name: ErrorName.INVALID_CREDENTIALS }) }

    return await authenticationService.createApiToken(user)
  },

  async requestPasswordChange (email) {
    const user = await authenticationService.getUserByEmail(email)
    const passwordChangeToken = await authenticationService.createPasswordChangeToken(user)
    await emailService.sendPasswordChangeToken(passwordChangeToken, user.email)
  },

  async changePasswordWithToken ({ userId, password, token }) {
    await withTransaction(async () => {
      const user = await authenticationService.getUserById(userId)
      const decodedToken = await authenticationService.validateAndDecodePasswordChangeToken(token)

      if (decodedToken.sub !== user.id) {
        throw createError({
          name: ErrorName.TOKEN_INVALID,
          extra: { tokenType: TokenType.PASSWORD_CHANGE }
        })
      }

      const passwordHash = await cryptographyService.createCryptographicHash(password)
      await usersRepository.updateUser({ ...user, passwordHash })
    })
  }
})
