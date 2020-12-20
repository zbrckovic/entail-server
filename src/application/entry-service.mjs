import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'
import { ActivationStatus, Role, User } from '../domain/user.mjs'

export const EntryService = ({
  environment,
  usersRepository,
  cryptographyService,
  emailService,
  authenticationService
}) => {
  const result = {
    async register ({ email, password }) {
      const passwordHash = await cryptographyService.createCryptographicHash(password)

      const [activationStatus, activationCode] = await generateActivationStatusWithCode()

      const user = User({
        email,
        passwordHash,
        activationStatus,
        roles: [Role.REGULAR]
      })

      await usersRepository.createUser(user)
      await emailService.sendActivationCode(activationCode, email)

      return await authenticationService.generateApiToken()
    },

    async login ({ email, password }) {
      const user = await authenticationService.verifyCredentialsAndGetUser({ email, password })
      if (!user.activityStatus.isActivated) {
        throw createError({ name: ErrorName.USER_NOT_ACTIVATED })
      }
      return await authenticationService.generateApiToken(user)
    },

    async refreshApiToken (userId) {
      const user = await authenticationService.getUserById(userId)
      if (!user.activityStatus.isActivated) {
        throw createError({ name: ErrorName.USER_NOT_ACTIVATED })
      }
      return await authenticationService.generateApiToken(user)
    },

    async activateUser (userId, activationCode) {
      const user = await authenticationService.getUserById(userId)
      await authenticationService.verifyActivationCode(user, activationCode)

      await usersRepository.updateUser({
        ...user,
        activationStatus: ActivationStatus({
          isActivated: true,
          activationCodeHash: undefined,
          activationCodeExpiresOn: undefined
        })
      })
    },

    async refreshActivationCode (userId) {
      const user = await authenticationService.getUserById(userId)

      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }

      const [activationStatus, activationCode] = await generateActivationStatusWithCode()

      await usersRepository.updateUser({ ...user, activationStatus })
      await emailService.sendActivationCode(activationCode, user.email)
    }
  }

  const generateActivationStatusWithCode = async () => {
    const activationCode = await authenticationService.generateActivationCode()
    const activationCodeHash = await cryptographyService.createCryptographicHash(activationCode)
    const activationCodeExpiresOn = moment().add(
      environment.activationCodeValidPeriodMinutes,
      'minutes'
    )

    const activationStatus = ActivationStatus({
      isActivated: false,
      activationCodeHash,
      activationCodeExpiresOn
    })

    return [activationStatus, activationCode]
  }

  return result
}
