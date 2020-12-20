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

      const apiToken = await authenticationService.generateApiToken()

      return [user, apiToken]
    },

    async login ({ email, password }) {
      const user = await authenticationService.verifyCredentials({ email, password })
      const apiToken = await authenticationService.generateApiToken()

      return [user, apiToken]
    },

    async activate (user, activationCode) {
      await authenticationService.verifyActivationCode(user, activationCode)

      const activationStatus = ActivationStatus({ isActivated: true })
      const userWithNewActivationStatus = { ...user, activationStatus }

      await usersRepository.updateUser(userWithNewActivationStatus)
    },

    async refreshActivationCode (userId) {
      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }

      const [activationStatus, activationCode] = generateActivationStatusWithCode()
      const userWithNewActivationStatus = { ...user, activationStatus }
      await usersRepository.updateUser(userWithNewActivationStatus)

      return activationCode
    },

    async refreshApiToken (userId) {
      const user = await usersRepository.getUserById(userId)
      return await authenticationService.generateApiToken(user)
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
