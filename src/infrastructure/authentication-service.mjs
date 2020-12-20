import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'
import { TokenType } from './token-type.mjs'

export const AuthenticationService = ({ environment, cryptographyService, usersRepository }) => {
  const tokenSecret = environment.tokenSecret

  const apiTokenExpiresInSeconds = moment.duration(
    environment.apiTokenExpiresInMinutes,
    'minutes'
  ).asSeconds()

  const emailVerificationTokenExpiresInSeconds = moment.duration(
    environment.emailVerificationTokenExpiresInMinutes,
    'minutes'
  ).asSeconds()

  const passwordChangeTokenExpiresInSeconds = moment.duration(
    environment.passwordChangeTokenExpiresInMinutes,
    'minutes'
  ).asSeconds()

  const result = {
    // Returns user or throws.
    async getUserById (userId) {
      const user = usersRepository.getUserById(userId)
      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
      return user
    },

    // Returns user or throws.
    async getUserByEmail (email) {
      const user = await usersRepository.getUserByEmail(email)
      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
      return user
    },

    async createApiToken (user) {
      return await cryptographyService.createToken({
        payload: {
          type: TokenType.API,
          email: user.email,
          email_verified: user.isEmailVerified,
          roles: user.roles
        },
        expiresIn: apiTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodeApiToken (token) {
      return await validateAndDecodeToken(token, TokenType.API)
    },

    async createEmailVerificationToken (user) {
      return await cryptographyService.createToken({
        payload: {
          type: TokenType.EMAIL_VERIFICATION,
          email: user.email
        },
        expiresIn: emailVerificationTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodeEmailVerificationToken (token) {
      return await validateAndDecodeToken(token, TokenType.EMAIL_VERIFICATION)
    },

    async createPasswordChangeToken (user) {
      return await cryptographyService.createToken({
        payload: {
          type: TokenType.PASSWORD_CHANGE,
          email: user.email
        },
        expiresIn: passwordChangeTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodePasswordChangeToken (token) {
      return await validateAndDecodeToken(token, TokenType.PASSWORD_CHANGE)
    }
  }

  // Checks whether `token` is valid and of the required `type`. Returns decoded `token` or throws.
  const validateAndDecodeToken = async (token, type) => {
    let decodedToken
    try {
      decodedToken = await cryptographyService.validateAndDecodeToken(token, tokenSecret)
    } catch (error) {
      throw createError({ name: ErrorName.TOKEN_INVALID })
    }

    if (decodedToken.type !== type) {
      throw createError({ name: ErrorName.TOKEN_INVALID })
    }

    return decodedToken
  }

  return result
}
