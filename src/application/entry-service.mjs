import moment from 'moment'
import { createError, ErrorName } from '../common/error.mjs'
import { ActivationStatus, Role, Session, User } from '../domain/user.mjs'

export const EntryService = ({
  environment,
  usersRepository,
  cryptographyService,
  emailService,
  authenticationService
}) => {
  const result = Object.freeze({
    async register ({ email, password }) {
      const passwordHash = await cryptographyService.createSecureHash(password)

      const [activationStatus, activationCode] = await generateActivationStatusWithCode()
      const [session, refreshToken] = await generateSessionWithRefreshToken()

      const user = User({
        email,
        passwordHash,
        activationStatus,
        session,
        roles: [Role.REGULAR]
      })
      await usersRepository.createUser(user)
      await emailService.sendActivationCode(activationCode, email)

      const apiToken = await authenticationService.generateApiToken()

      return { user, refreshToken, apiToken }
    },

    async login ({ email, password }) {
      const user = await authenticationService.verifyCredentials({ email, password })

      const [session, refreshToken] = await generateSessionWithRefreshToken()
      const userWithNewSession = user.setSession(session)
      await usersRepository.updateUser(userWithNewSession)

      const apiToken = await authenticationService.generateApiToken()

      return { user: userWithNewSession, refreshToken, apiToken }
    },

    async activate (user, activationCode) {
      await authenticationService.verifyActivationCode(user, activationCode)

      const newActivationStatus = ActivationStatus({ isActivated: true })
      const userWithNewActivationStatus = user.setActivationStatus(newActivationStatus)

      await usersRepository.updateUser(userWithNewActivationStatus)
    },

    async refreshActivationCode (user) {
      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }

      const [activationStatus, activationCode] = generateActivationStatusWithCode()
      const userWithNewActivationStatus = user.setActivationStatus(activationStatus)
      await usersRepository.updateUser(userWithNewActivationStatus)

      return activationCode
    },

    async refreshApiToken (user, refreshToken) {
      await authenticationService.verifyRefreshToken(user, refreshToken)
      return await authenticationService.generateApiToken(user)
    }
  })

  const generateActivationStatusWithCode = async () => {
    const activationCode = await authenticationService.generateActivationCode()
    const activationCodeHash = await cryptographyService.createSecureHash(activationCode)
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

  const generateSessionWithRefreshToken = async () => {
    const refreshToken = await authenticationService.generateRefreshToken()
    const refreshTokenHash = await cryptographyService.createSecureHash(refreshToken)
    const refreshTokenExpiresOn = moment().add(environment.refreshTokenExpiresInMinutes, 'minutes')

    const session = Session({ refreshTokenHash, refreshTokenExpiresOn })

    return [session, refreshToken]
  }

  return result
}
