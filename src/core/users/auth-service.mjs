import { createError, ErrorName } from '../../global/error.mjs'
import moment from 'moment'

export const AuthService = ({
  environment: {
    activationCodeValidPeriodMinutes
  },
  usersRepository,
  cryptographyService: {
    createPasswordHash,
    generateActivationCode,
    isPasswordCorrect
  },
  emailService
}) => ({
  register: async ({ email, password }) => {
    const passwordHash = await createPasswordHash(password)
    const activationCode = await generateActivationCode()

    const activationCodeExpiresOn = moment().add(
      activationCodeValidPeriodMinutes,
      'minutes'
    )

    const user = await usersRepository.createUser({
      email,
      passwordHash,
      activationCode,
      activationCodeExpiresOn
    })

    await emailService.sendActivationCode(activationCode, email)

    return user
  },

  login: async ({ email, password }) => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

    const isPasswordOk = await isPasswordCorrect(password, user.passwordHash)
    if (!isPasswordOk) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

    return user
  },

  activate: async ({ email, activationCode }) => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

    if (user.isActivated) throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
    if (user.activationCodeExpiresOn.isBefore(moment())) {
      throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
    }

    if (user.activationCode !== activationCode) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

    await usersRepository.updateUser({
      id: user.id,
      isActivated: true,
      activationCode: null,
      activationCodeExpiresOn: null
    })
  }
})
