import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'

export const AuthenticationService = ({ environment, cryptographyService, usersRepository }) => {
  const apiTokenSecret = environment.apiTokenSecret
  const apiTokenExpiresInSeconds = moment.duration(
    environment.apiTokenExpiresInMinutes, 'minutes'
  ).asSeconds()

  return {
    // Returns user or throws.
    async getUserById (userId) {
      const user = usersRepository.getUserById(userId)
      if (user === undefined) {
        createError({ name: ErrorName.INVALID_CREDENTIALS })
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

    async generateApiToken (user) {
      return await cryptographyService.generateJwt({
        key: 'user',
        payload: {
          id: user.id,
          isActivated: user.activationStatus.isActivated,
          roles: user.roles
        },
        expiresIn: apiTokenExpiresInSeconds,
        secret: apiTokenSecret,
        subject: user.id
      })
    },

    // Checks whether `apiToken` is valid. Returns decoded `token` or throws.
    async validateAndDecodeJwt (apiToken) {
      return await cryptographyService.validateAndDecodeJwt(apiToken, apiTokenSecret)
    },

    async generateActivationCode () {
      return await cryptographyService.generateActivationCode()
    },

    // Checks whether `user` can be activated with `activationCode`. Returns undefined or throws.
    async verifyActivationCode (user, activationCode) {
      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }

      if (user.activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      const isActivationCodeValid = await cryptographyService.isCryptographicHashValid(
        user.activationStatus.activationCodeHash,
        activationCode
      )

      if (!isActivationCodeValid) {
        throw createError({ name: ErrorName.INVALID_ACTIVATION_CODE })
      }
    },

    async verifyCredentialsAndGetUser ({ email, password }) {
      const user = await this.getUserByEmailOrThrow(email)

      const isPasswordValid = await cryptographyService.isCryptographicHashValid(
        user.passwordHash,
        password
      )

      if (!isPasswordValid) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    }
  }
}
