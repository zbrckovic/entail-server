import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'

export const AuthenticationService = ({ environment, cryptographyService, usersRepository }) => {
  const apiTokenSecret = environment.apiTokenSecret
  const apiTokenExpiresInSeconds = moment.duration(
    environment.apiTokenExpiresInMinutes, 'minutes'
  ).asSeconds()

  return Object.freeze({
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

    async verifyApiToken (apiToken) {
      return await cryptographyService.verifyJwt(apiToken, apiTokenSecret)
    },

    async generateRefreshToken () {
      return await cryptographyService.generateSecureCode()
    },

    async verifyRefreshToken (user, refreshToken) {
      const refreshTokenHash = user.session?.refreshTokenHash

      if (refreshTokenHash === undefined) return false

      const isRefreshTokenValid = await cryptographyService.doesValueMatchSecureHash(
        refreshToken, refreshTokenHash
      )

      if (!isRefreshTokenValid) return false
    },

    async generateActivationCode () {
      return await cryptographyService.createSecureHash()
    },

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
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }
    },

    async verifyCredentials ({ email, password }) {
      const user = await usersRepository.getUserByEmail(email)

      if (user === undefined) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      const isPasswordValid = await cryptographyService.doesValueMatchSecureHash(
        password,
        user.passwordHash
      )

      if (!isPasswordValid) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    }
  })
}
