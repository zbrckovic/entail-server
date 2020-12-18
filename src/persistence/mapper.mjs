import moment from 'moment'
import { ActivationStatus, Session, User } from '../domain/user.mjs'

export const Mapper = () => {
  const result = Object.freeze({
    userFromDAO ({
      id,
      email,
      passwordHash,
      activationStatus,
      session,
      roles
    }) {
      return User({
        id: id ?? undefined,
        email,
        passwordHash,
        activationStatus: activationStatusFromDAO(activationStatus),
        session: session !== null ? sessionFromDAO(session) : undefined,
        roles: roles.map(roleDAO => roleFromDAO(roleDAO))
      })
    },
    userToDAOSpecs ({
      id,
      email,
      passwordHash,
      activationStatus,
      session,
      roles
    }) {
      return {
        id: id ?? null,
        email,
        passwordHash,
        activationStatus: activationStatusToDAOSpecs(activationStatus),
        session: session !== undefined ? sessionToDAOSpecs(session) : null,
        roles: roles.map(role => roleToDAOSpecs(role))
      }
    },
  })

  const sessionFromDAO = ({ refreshTokenHash, refreshTokenExpiresOn }) => (
    Session({
      refreshTokenHash: refreshTokenHash ?? undefined,
      refreshTokenExpiresOn: refreshTokenExpiresOn === null
        ? undefined
        : moment(refreshTokenExpiresOn)
    })
  )

  const sessionToDAOSpecs = ({ refreshTokenHash, refreshTokenExpiresOn }) => ({
    refreshTokenHash: refreshTokenHash ?? null,
    refreshTokenExpiresOn: refreshTokenExpiresOn?.toDate() ?? null
  })

  const roleToDAOSpecs = role => ({ name: role })

  const roleFromDAO = ({ name }) => name

  const activationStatusFromDAO = ({
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

  const activationStatusToDAOSpecs = ({
    isActivated,
    activationCodeHash,
    activationCodeExpiresOn
  }) => ({
    isActivated,
    activationCodeHash: activationCodeHash ?? null,
    activationCodeExpiresOn: activationCodeExpiresOn?.toDate() ?? null
  })

  return result
}
