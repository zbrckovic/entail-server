import { createError, ErrorName } from '../common/error.mjs'
import moment from 'moment'
import stampit from '@stamp/it'
import { ActivationStatus, Role, User } from '../domain/user.mjs'

export const EntryService = stampit({
  init({ environment, repository, cryptographyService, emailService }) {
    this.environment = environment
    this.repository = repository
    this.cryptographyService = cryptographyService
    this.emailService = emailService
  },
  methods: {
    async register({ email, password }) {
      const passwordHash = await this.cryptographyService.createPasswordHash(password)
      const code = await this.cryptographyService.generateActivationCode()

      const expiresOn = moment().add(this.environment.activationCodeValidPeriodMinutes, 'minutes')

      let user = User({
        email,
        passwordHash,
        activationStatus: ActivationStatus({
          isActivated: false,
          code,
          expiresOn
        }),
        roles: [Role.REGULAR]
      })

      user = await this.repository.createUser(user)

      await this.emailService.sendActivationCode(user.activationStatus.code, email)

      return user
    },

    async login({ email, password }) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      const isPasswordOk = await this.cryptographyService.isPasswordCorrect(
        password,
        user.passwordHash
      )
      if (!isPasswordOk) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    },

    async activate({ email, code }) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      const { activationStatus } = user

      if (activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }
      if (activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      if (user.code !== code) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      activationStatus.isActivated = true
      activationStatus.code = undefined
      activationStatus.expiresOn = undefined

      await this.repository.updateUser(user)
    }
  }
})
