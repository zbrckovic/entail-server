import stampit from '@stamp/it'
import { v4 as uuid } from 'uuid'
import moment from 'moment'

export const User = stampit({
  init({ id, email, passwordHash, activationStatus, roles }) {
    this.id = id ?? uuid()
    this.email = email
    this.passwordHash = passwordHash
    this.activationStatus = activationStatus
    this.roles = roles
  }
})

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

export const ActivationStatus = stampit({
  init({ isActivated, code, expiresOn }) {
    this.isActivated = isActivated
    this.code = code
    this.expiresOn = expiresOn
  },
  methods: {
    didExpire() {
      return this.expiresOn.isBefore(moment())
    }
  }
})
