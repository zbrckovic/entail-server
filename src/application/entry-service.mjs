import { createError, ErrorName } from '../common/error.mjs'
import moment from 'moment'
import stampit from '@stamp/it'
import { Role } from '../domain/users/role.mjs'

export const EntryService = stampit({
  init ({ environment, repository, cryptographyService, emailService }) {
    this.environment = environment
    this.repository = repository
    this.cryptographyService = cryptographyService
    this.emailService = emailService
  },
  methods: {
    async register ({ email, password }) {
      const passwordHash = await this.cryptographyService.createPasswordHash(password)
      const activationCode = await this.cryptographyService.generateActivationCode()

      const activationCodeExpiresOn = moment().add(
        this.environment.activationCodeValidPeriodMinutes,
        'minutes'
      )

      const user = await this.repository.createUser({
        email,
        passwordHash,
        activationCode,
        activationCodeExpiresOn,
        roles: [Role.REGULAR]
      })

      await this.emailService.sendActivationCode(activationCode, email)

      return { ...user }
    },

    async login ({ email, password }) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      const isPasswordOk = await this.cryptographyService.isPasswordCorrect(
        password,
        user.passwordHash
      )
      if (!isPasswordOk) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    },

    async activate ({ email, activationCode }) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      if (user.isActivated) throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      if (user.activationCodeExpiresOn.isBefore(moment())) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      if (user.activationCode !== activationCode) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      await this.repository.updateUser({
        id: user.id,
        isActivated: true,
        activationCode: null,
        activationCodeExpiresOn: null
      })
    }
  }
})
