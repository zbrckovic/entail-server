import { Role, User } from '../domain/user.mjs'
import { createError, ErrorName } from '../common/error.mjs'

// Entry point for non-authenticated users.
export const EntryService = ({
  usersRepository,
  cryptographyService,
  emailService,
  authenticationService
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

    if (!isPasswordValid) {
      throw createError({ name: ErrorName.INVALID_CREDENTIALS })
    }

    return await authenticationService.createApiToken(user)
  }
})
