import stampit from '@stamp/it'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import validator from 'validator'
import { createError } from '../common/error.mjs'

export const User = stampit({
  init ({ id, email, passwordHash, activationStatus, session, roles = [] }) {
    this.id = id ?? uuid()
    this.email = email
    this.passwordHash = passwordHash
    this.activationStatus = activationStatus
    this.session = session
    this.roles = roles

    this._validate()
  },
  methods: {
    _validate () {
      if (!validator.isEmail(this.email)) {
        throw createError({ message: 'email is invalid' })
      }
      if (this.passwordHash.length !== 60) {
        throw createError({ message: 'passwordHash is invalid' })
      }
      if (this.activationStatus === undefined) {
        throw createError({ message: 'activationStatus not provided' })
      }
    }
  }
})

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

export const ActivationStatus = stampit({
  init ({ isActivated, activationCodeHash, activationCodeExpiresOn }) {
    this.isActivated = isActivated
    this.activationCodeHash = activationCodeHash
    this.activationCodeExpiresOn = activationCodeExpiresOn
  },
  methods: {
    didExpire () {
      return this.activationCodeExpiresOn.isBefore(moment())
    }
  }
})

export const Session = stampit({
  init ({ refreshTokenHash, refreshTokenExpiresOn }) {
    this.refreshTokenHash = refreshTokenHash
    this.refreshTokenExpiresOn = refreshTokenExpiresOn
  },
  methods: {
    didExpire () {
      return this.refreshTokenExpiresOn.isBefore(moment())
    }
  }
})
