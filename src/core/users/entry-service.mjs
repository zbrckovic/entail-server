import { createError, ErrorName } from '../../global/error.mjs'
import moment from 'moment'
import stampit from '@stamp/it'
import { Role } from './role.mjs'

export const EntryService = stampit({
  init ({ environment, repository, cryptographyService, emailService }) {
    this.environment = environment
    this.repository = repository
    this.cryptographyService = cryptographyService
    this.emailService = emailService
  },
  methods: {
    async register ({ email, password }) {
      return this.repository.withTransaction(async repository => {
        const passwordHash = await this.cryptographyService.createPasswordHash(password)
        const activationCode = await this.cryptographyService.generateActivationCode()

        const activationCodeExpiresOn = moment().add(
          this.environment.activationCodeValidPeriodMinutes,
          'minutes'
        )

        const user = await repository.createUser({
          email,
          passwordHash,
          activationCode,
          activationCodeExpiresOn
        })
        await repository.setRoleForUser(user.id, Role.REGULAR)

        const roles = await repository.getRolesForUser(user.id)

        await this.emailService.sendActivationCode(activationCode, email)

        return { ...user, roles }
      })
    },

    async login ({ email, password }) {
      return await this.repository.withTransaction(async repository => {
        const user = await repository.getUserByEmail(email)
        if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

        const isPasswordOk = await this.cryptographyService.isPasswordCorrect(
          password,
          user.passwordHash
        )
        if (!isPasswordOk) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

        const roles = await repository.getRolesForUser(user.id)

        return { ...user, roles }
      })
    },

    async activate ({ email, activationCode }) {
      return await this.repository.withTransaction(async repository => {
        const user = await repository.getUserByEmail(email)
        if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

        if (user.isActivated) throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
        if (user.activationCodeExpiresOn.isBefore(moment())) {
          throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
        }

        if (user.activationCode !== activationCode) {
          throw createError({ name: ErrorName.INVALID_CREDENTIALS })
        }

        await repository.updateUser({
          id: user.id,
          isActivated: true,
          activationCode: null,
          activationCodeExpiresOn: null
        })
      })
    }
  }
})
