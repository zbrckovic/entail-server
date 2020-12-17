import { createError, ErrorName } from '../common/error.mjs'
import moment from 'moment'
import stampit from '@stamp/it'
import { ActivationStatus, Role, Session, User } from '../domain/user.mjs'

export const EntryService = stampit({
  init({ environment, repository, cryptographyService, emailService }) {
    this.environment = environment
    this.repository = repository
    this.cryptographyService = cryptographyService
    this.emailService = emailService
  },
  methods: {
    async register({ email, password }) {
      const passwordHash = await this.cryptographyService.createSecureHash(password)

      const activationCode = await this.cryptographyService.generateSecureCode()
      const activationCodeHash = await this.cryptographyService.createSecureHash(activationCode)
      const activationCodeExpiresOn = moment().add(
        this.environment.activationCodeValidPeriodMinutes, 'minutes'
      )

      const refreshToken = await this.cryptographyService.generateSecureCode()
      const refreshTokenHash = await this.cryptographyService.createSecureHash(refreshToken)
      const refreshTokenExpiresOn = moment().add(
        this.environment.refreshTokenExpiresInMinutes, 'minutes'
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

      user = await this.repository.createUser(user)

      await this.emailService.sendActivationCode(activationCode, email)

      return { user, refreshToken }
    },

    async login({ email, password }) {
      let user = await this._getUserByEmailOrThrow(email)

      const doesValueMatchSecureHash = await this.cryptographyService.doesValueMatchSecureHash(
        password,
        user.passwordHash
      )
      if (!doesValueMatchSecureHash) throw createError({ name: ErrorName.INVALID_CREDENTIALS })

      const refreshToken = await this.cryptographyService.generateSecureCode()
      const refreshTokenHash = await this.cryptographyService.createSecureHash(refreshToken)
      const refreshTokenExpiresOn = moment().add(
        this.environment.refreshTokenExpiresInMinutes, 'minutes'
      )

      user = await this.repository.updateUser(user.id, user => {
        user.session = Session({
          refreshTokenHash,
          refreshTokenExpiresOn
        })

        return user
      })

      return { user, refreshToken }
    },

    async activate({ email, code }) {
      const user = await this._getUserByEmailOrThrow(email)

      if (user.activationStatus.isActivated) {
        throw createError({ name: ErrorName.USER_ALREADY_ACTIVATED })
      }
      if (user.activationStatus.didExpire()) {
        throw createError({ name: ErrorName.ACTIVATION_CODE_EXPIRED })
      }

      const isActivationCodeCorrect = await this.cryptographyService.doesValueMatchSecureHash(
        code, user.activationStatus.activationCodeHash
      )

      if (!isActivationCodeCorrect) {
        throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      }

      user.activationStatus.isActivated = true
      user.activationStatus.activationCodeHash = undefined
      user.activationStatus.activationCodeExpiresOn = undefined

      await this.repository.updateUser(user)
    },

    async _getUserByEmailOrThrow(email) {
      const user = await this.repository.getUserByEmail(email)
      if (user === undefined) throw createError({ name: ErrorName.INVALID_CREDENTIALS })
      return user
    }
  }
})
