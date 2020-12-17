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
      const codeHash = this.cryptographyService.createPasswordHash(code)

      const expiresOn = moment().add(this.environment.activationCodeValidPeriodMinutes, 'minutes')

      let user = User({
        email,
        passwordHash,
        activationStatus: ActivationStatus({
          isActivated: false,
          codeHash,
          expiresOn
        }),
        roles: [Role.REGULAR]
      })

      user = await this.repository.createUser(user)

      await this.emailService.sendActivationCode(user.activationStatus.code, email)

      return user
    },

    async login({ email, password }) {
      const user = await this._getUserByEmailOrThrow(email)

      const isPasswordCorrect = await this.cryptographyService.isPasswordCorrect(
        password,
        user.passwordHash
      )
      if (!isPasswordCorrect) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      return user
    },

    async activate({ email, code }) {
      const user = await this._getUserByEmailOrThrow(email)

      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }
      if (user.activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      const isCodeCorrect = await this.cryptographyService.isPasswordCorrect(
        code, user.activationStatus.codeHash
      )

      if (!isCodeCorrect) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      user.activationStatus.isActivated = true
      user.activationStatus.codeHash = undefined
      user.activationStatus.expiresOn = undefined

      await this.repository.updateUser(user)
    },

    async _getUserByEmailOrThrow(email) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      return user
    }
  }
})
