import stampit from '@stamp/it'
import moment from 'moment'
import { ActivationStatus, Session, User } from '../domain/user.mjs'

export const Mapper = stampit({
  methods: {
    userFromDAO({
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
        activationStatus: this.activationStatusFromDAO(activationStatus),
        session: session !== null ? this.sessionFromDAO(session) : undefined,
        roles: roles.map(roleDAO => this.roleFromDAO(roleDAO))
      })
    },
    userToDAOSpecs({
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
        activationStatus: this.activationStatusToDAOSpecs(activationStatus),
        session: session !== undefined ? this.sessionToDAOSpecs(session) : null,
        roles: roles.map(role => this.roleToDAOSpecs(role))
      }
    },
    activationStatusFromDAO({
      isActivated,
      activationCodeHash,
      activationCodeExpiresOn
    }) {
      return ActivationStatus({
        isActivated,
        activationCodeHash: activationCodeHash ?? undefined,
        activationCodeExpiresOn: activationCodeExpiresOn === null
          ? undefined
          : moment(activationCodeExpiresOn)
      })
    },
    activationStatusToDAOSpecs({
      isActivated,
      activationCodeHash,
      activationCodeExpiresOn
    }) {
      return {
        isActivated,
        activationCodeHash: activationCodeHash ?? null,
        activationCodeExpiresOn: activationCodeExpiresOn?.toDate() ?? null
      }
    },
    sessionFromDAO({ refreshTokenHash, refreshTokenExpiresOn }) {
      return Session({
        refreshTokenHash: refreshTokenHash ?? undefined,
        refreshTokenExpiresOn: refreshTokenExpiresOn === null
          ? undefined
          : moment(refreshTokenExpiresOn)
      })
    },
    sessionToDAOSpecs({ refreshTokenHash, refreshTokenExpiresOn }) {
      return {
        refreshTokenHash: refreshTokenHash ?? null,
        refreshTokenExpiresOn: refreshTokenExpiresOn?.toDate() ?? null
      }
    },
    roleToDAOSpecs(role) {
      return { name: role }
    },
    roleFromDAO({ name }) {
      return name
    }
  }
})
