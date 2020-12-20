import { v4 as uuid } from 'uuid'
import moment from 'moment'

export const User = ({
  id = uuid(),
  email,
  passwordHash,
  activationStatus,
  roles = []
} = {}) => {
  return {
    id: id ?? uuid(),
    email: email,
    passwordHash: passwordHash,
    activationStatus: activationStatus,
    roles: roles
  }
}

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

export const ActivationStatus = ({
  isActivated = false,
  activationCodeHash,
  activationCodeExpiresOn
} = {}) => ({
  isActivated,
  activationCodeHash,
  activationCodeExpiresOn,
  didExpire () {
    return this.activationCodeExpiresOn.isBefore(moment())
  }
})
