import moment from 'moment'
import { ActivationStatus, Session, User } from '../domain/user.mjs'

export const sessionFromModel = ({
  refreshTokenHash,
  refreshTokenExpiresOn
}) => (
  Session({
    refreshTokenHash: refreshTokenHash ?? undefined,
    refreshTokenExpiresOn: refreshTokenExpiresOn === null
      ? undefined
      : moment(refreshTokenExpiresOn)
  })
)

export const sessionToModelSpecs = ({
  refreshTokenHash,
  refreshTokenExpiresOn
}) => ({
  refreshTokenHash: refreshTokenHash ?? null,
  refreshTokenExpiresOn: refreshTokenExpiresOn?.toDate() ?? null
})

export const roleToModelSpecs = role => ({ name: role })

export const roleFromModel = ({ name }) => name

export const activationStatusFromModel = ({
  isActivated,
  activationCodeHash,
  activationCodeExpiresOn
}) => (
  ActivationStatus({
    isActivated,
    activationCodeHash: activationCodeHash ?? undefined,
    activationCodeExpiresOn: activationCodeExpiresOn === null
      ? undefined
      : moment(activationCodeExpiresOn)
  })
)

export const activationStatusToModelSpecs = ({
  isActivated,
  activationCodeHash,
  activationCodeExpiresOn
}) => ({
  isActivated,
  activationCodeHash: activationCodeHash ?? null,
  activationCodeExpiresOn: activationCodeExpiresOn?.toDate() ?? null
})

export const userFromModel = ({
  id,
  email,
  passwordHash,
  activationStatus,
  session,
  roles
}) => (
  User({
    id: id ?? undefined,
    email,
    passwordHash,
    activationStatus: activationStatusFromModel(activationStatus),
    session: session !== null ? sessionFromModel(session) : undefined,
    roles: roles.map(roleDAO => roleFromModel(roleDAO))
  })
)

export const userToModelSpecs = ({
  id,
  email,
  passwordHash,
  activationStatus,
  session,
  roles
}) => ({
  id: id ?? null,
  email,
  passwordHash,
  activationStatus: activationStatusToModelSpecs(activationStatus),
  session: session !== undefined ? sessionToModelSpecs(session) : null,
  roles: roles.map(role => roleToModelSpecs(role))
})
