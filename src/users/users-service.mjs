import { createError, ErrorName } from '../error'
import moment from 'moment'

export const UsersService = ({ environment, usersRepository, cryptographyService }) => ({
  register: async ({ email, password }) => {
    const passwordHash = await cryptographyService.createPasswordHash(password)

    const activationCode = await cryptographyService.generateActivationCode()

    const activationCodeExpiresOn = moment().add(
      environment.activationCodeValidityPeriodMinutes,
      'minutes'
    )

    return await usersRepository.createUser({
      email,
      passwordHash,
      activationCode,
      activationCodeExpiresOn
    })
  },

  login: async ({ email, password }) => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError(ErrorName.INVALID_CREDENTIALS)

    const isPasswordOk = await cryptographyService.isPasswordCorrect(password, user.passwordHash)
    if (!isPasswordOk) throw createError(ErrorName.INVALID_CREDENTIALS)

    return user
  },

  activate: async ({ email, activationCode }) => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError(ErrorName.INVALID_CREDENTIALS)

    if (user.isActivated) throw createError(ErrorName.USER_ALREADY_ACTIVATED)
    if (user.activationCodeExpiresOn.isBefore(moment())) {
      throw createError(ErrorName.ACTIVATION_CODE_EXPIRED)
    }

    if (user.activationCode !== activationCode) throw createError(ErrorName.INVALID_CREDENTIALS)

    await usersRepository.updateUser({
      id: user.id,
      isActivated: true,
      activationCode: null,
      activationCodeExpiresOn: null
    })
  }
})
