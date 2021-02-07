import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'
import { TokenType } from './token-type.mjs'
import stampit from '@stamp/it'

export const AuthenticationService = stampit({
  init ({
    environment,
    cryptographyService,
    usersRepository
  }) {
    this.tokenSecret = environment.tokenSecret
    this.cryptographyService = cryptographyService
    this.usersRepository = usersRepository

    this.apiTokenExpiresInSeconds = moment.duration(
      environment.apiTokenExpiresInMinutes,
      'minutes'
    ).asSeconds()

    this.emailVerificationTokenExpiresInSeconds = moment.duration(
      environment.emailVerificationTokenExpiresInMinutes,
      'minutes'
    ).asSeconds()

    this.passwordChangeTokenExpiresInSeconds = moment.duration(
      environment.passwordChangeTokenExpiresInMinutes,
      'minutes'
    ).asSeconds()
  },
  methods: {
    // Returns user or throws.
    async getUserById (userId) {
      const user = await this.usersRepository.getUserById(userId)
      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
      return user
    },

    // Returns user or throws.
    async getUserByEmail (email) {
      const user = await this.usersRepository.getUserByEmail(email)
      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
      return user
    },

    async createApiToken (user) {
      return await this.cryptographyService.createToken({
        payload: {
          type: TokenType.API,
          email: user.email,
          email_verified: user.isEmailVerified,
          roles: user.roles
        },
        expiresIn: this.apiTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodeApiToken (token) {
      return await this.validateAndDecodeToken(token, TokenType.API)
    },

    async createEmailVerificationToken (user) {
      return await this.cryptographyService.createToken({
        payload: {
          type: TokenType.EMAIL_VERIFICATION,
          email: user.email
        },
        expiresIn: this.emailVerificationTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodeEmailVerificationToken (token) {
      return await this.validateAndDecodeToken(token, TokenType.EMAIL_VERIFICATION)
    },

    async createPasswordChangeToken (user) {
      return await this.cryptographyService.createToken({
        payload: {
          type: TokenType.PASSWORD_CHANGE,
          email: user.email
        },
        expiresIn: this.passwordChangeTokenExpiresInSeconds,
        subject: user.id
      })
    },

    async validateAndDecodePasswordChangeToken (token) {
      return await this.validateAndDecodeToken(token, TokenType.PASSWORD_CHANGE)
    },

    // Checks whether `token` is valid and of the required `type`. Returns decoded `token` or throws.
    async validateAndDecodeToken (token, type) {
      const decodedToken = await this.cryptographyService.validateAndDecodeToken(
        token,
        this.tokenSecret
      )

      if (decodedToken.type !== type) {
        throw createError({ name: ErrorName.TOKEN_INVALID })
      }

      return decodedToken
    }
  }
})
