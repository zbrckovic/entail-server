import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'

export const AuthenticationService = ({ environment, cryptographyService, usersRepository }) => {
  const apiTokenSecret = environment.apiTokenSecret
  const apiTokenExpiresInSeconds = moment.duration(
    environment.apiTokenExpiresInMinutes, 'minutes'
  ).asSeconds()

  return {
    async getUserById (userId) {
      const user = usersRepository.getUserById(userId)
      if (user === undefined) {
        createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
    },

    async getUserByEmail (email) {
      const user = await usersRepository.getUserByEmail(email)
      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
    },

    async generateApiToken (user) {
      const payload = {
        id: user.id,
        isActivated: user.activationStatus.isActivated,
        roles: user.roles
      }

      return await cryptographyService.generateJwt({
        payload,
        expiresIn: apiTokenExpiresInSeconds,
        secret: apiTokenSecret,
        subject: user.id
      })
    },

    // Checks whether `token` is valid. Returns decoded `token` or throws.
    async verifyApiToken (apiToken) {
      return await cryptographyService.verifyJwt(apiToken, apiTokenSecret)
    },

    async generateActivationCode () {
      return await cryptographyService.generateActivationCode()
    },

    // Checks whether `user` can be activated with `activationCode`.
    async verifyActivationCode (user, activationCode) {
      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }

      if (user.activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      const isActivationCodeCorrect = await cryptographyService.doesValueMatchSecureHash(
        activationCode, user.activationStatus.activationCodeHash
      )

      if (!isActivationCodeCorrect) {
        throw createError({ name: ErrorName.INVALID_ACTIVATION_CODE })
      }
    },

    // Checks whether credentials match any user. Returns matching user or throws.
    async verifyCredentials ({ email, password }) {
      const user = await this.getUserByEmail(email)

      const isPasswordValid = await cryptographyService.doesValueMatchCryptographicHash(
        password,
        user.passwordHash
      )

      if (!isPasswordValid) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    }
  }
}
