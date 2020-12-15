import stampit from '@stamp/it'
import moment from 'moment'
import { ActivationStatus, User } from '../domain/user.mjs'

export const Mapper = stampit({
  methods: {
    userFromDAO({
      id,
      email,
      passwordHash,
      activationStatus,
      roles
    }) {
      return User({
        id,
        email,
        passwordHash,
        activationStatus: this.activationStatusFromDAO(activationStatus),
        roles: roles.map(roleDAO => this.roleFromDAO(roleDAO))
      })
    },
    userToDAOSpecs({
      id,
      email,
      passwordHash,
      activationStatus,
      roles
    }) {
      return {
        id,
        email,
        passwordHash,
        activationStatus: this.activationStatusToDAOSpecs(activationStatus),
        roles: roles.map(role => this.roleToDAOSpecs(role))
      }
    },
    activationStatusFromDAO({
      isActivated,
      code,
      expiresOn
    }) {
      return ActivationStatus({
        isActivated,
        code: code ?? undefined,
        expiresOn: expiresOn === null ? undefined : moment(expiresOn)
      })
    },
    activationStatusToDAOSpecs({
      isActivated,
      code,
      expiresOn
    }) {
      return {
        isActivated,
        code: code ?? null,
        expiresOn: expiresOn?.toDate() ?? null
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
