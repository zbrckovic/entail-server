import { v4 as uuid } from 'uuid'
import moment from 'moment'
import validator from 'validator'
import { createError } from '../common/error.mjs'

export const User = ({
  id = uuid(),
  email,
  passwordHash,
  activationStatus,
  session,
  roles = []
}) => {
  if (!validator.isEmail(email)) throw createError({ message: 'email is invalid' })
  if (passwordHash.length !== 60) throw createError({ message: 'passwordHash is invalid' })
  if (activationStatus === undefined) {
    throw createError({ message: 'activationStatus not provided' })
  }

  return Object.freeze({
    id: id ?? uuid(),
    email: email,
    passwordHash: passwordHash,
    activationStatus: activationStatus,
    session: session,
    roles: roles
  })
}

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

export const ActivationStatus = ({
  isActivated,
  activationCodeHash,
  activationCodeExpiresOn
}) => (
  Object.freeze({
    isActivated,
    activationCodeHash,
    activationCodeExpiresOn,
    didExpire () {
      return this.activationCodeExpiresOn.isBefore(moment())
    }
  })
)

export const Session = ({
  refreshTokenHash,
  refreshTokenExpiresOn
}) => (
  Object.freeze({
    refreshTokenHash,
    refreshTokenExpiresOn,
    didExpire () {
      return this.refreshTokenExpiresOn.isBefore(moment())
    }
  })
)
