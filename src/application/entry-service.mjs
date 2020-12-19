import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'
import { ActivationStatus, Role, Session, User } from '../domain/user.mjs'

export const EntryService = ({
  environment,
  usersRepository,
  cryptographyService,
  emailService
}) => {
  const result = Object.freeze({
    async register ({
      email,
      password
    }) {
      const passwordHash = await cryptographyService.createSecureHash(password)

      const activationCode = await cryptographyService.generateSecureCode()
      const activationCodeHash = await cryptographyService.createSecureHash(activationCode)
      const activationCodeExpiresOn = moment().add(
        environment.activationCodeValidPeriodMinutes, 'minutes'
      )

      const refreshToken = await cryptographyService.generateSecureCode()
      const refreshTokenHash = await cryptographyService.createSecureHash(refreshToken)
      const refreshTokenExpiresOn = moment().add(
        environment.refreshTokenExpiresInMinutes, 'minutes'
      )

      let user = User({
        email,
        passwordHash,
        activationStatus: ActivationStatus({
          isActivated: false,
          activationCodeHash,
          activationCodeExpiresOn
        }),
        session: Session({
          refreshTokenHash,
          refreshTokenExpiresOn
        }),
        roles: [Role.REGULAR]
      })

      user = await usersRepository.createUser(user)

      await emailService.sendActivationCode(activationCode, email)

      return {
        user,
        refreshToken
      }
    },

    async login ({
      email,
      password
    }) {
      let user = await getUserByEmailOrThrow(email)

      const doesValueMatchSecureHash = await cryptographyService.doesValueMatchSecureHash(
        password,
        user.passwordHash
      )
      if (!doesValueMatchSecureHash) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      const refreshToken = await cryptographyService.generateSecureCode()
      const refreshTokenHash = await cryptographyService.createSecureHash(refreshToken)
      const refreshTokenExpiresOn = moment().add(
        environment.refreshTokenExpiresInMinutes, 'minutes'
      )

      user = await usersRepository.updateUserById(user.id, async user => {
        await user.createOrUpdateSession(Session({
          refreshTokenHash,
          refreshTokenExpiresOn
        }))
      })

      return {
        user,
        refreshToken
      }
    },

    async activate ({
      email,
      code
    }) {
      const user = await getUserByEmailOrThrow(email)

      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }
      if (user.activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      const isActivationCodeCorrect = await cryptographyService.doesValueMatchSecureHash(
        code, user.activationStatus.activationCodeHash
      )

      if (!isActivationCodeCorrect) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      user.activationStatus.isActivated = true
      user.activationStatus.activationCodeHash = undefined
      user.activationStatus.activationCodeExpiresOn = undefined

      await usersRepository.updateUser(user)
    }
  })

  const getUserByEmailOrThrow = async email => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })
    return user
  }

  return result
}
