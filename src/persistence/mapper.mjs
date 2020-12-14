import stampit from '@stamp/it'
import moment from 'moment'

export const Mapper = stampit({
  methods: {
    userFromDAO ({
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
        activationStatus: this.activationStatusFromDAO(activationStatus),
        roles: roles.map(roleDAO => this.roleFromDAO(roleDAO))
      }
    },
    userToDAO ({
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
        activationStatus: this.activationStatusToDAO(activationStatus),
        roles: roles.map(role => this.roleToDAO(role))
      }
    },
    activationStatusFromDAO ({
      isActivated,
      activationCode,
      activationCodeExpiresOn
    }) {
      return {
        isActivated,
        activationCode: activationCode ?? undefined,
        activationCodeExpiresOn: activationCodeExpiresOn === null
          ? undefined
          : moment(activationCodeExpiresOn)
      }
    },
    activationStatusToDAO ({
      isActivated,
      activationCode,
      activationCodeExpiresOn
    }) {
      return {
        isActivated,
        activationCode: activationCode ?? null,
        activationCodeExpiresOn: activationCodeExpiresOn?.toDate() ?? null
      }
    },
    roleToDAO (role) {
      return { name: role }
    },
    roleFromDAO (roleDAO) {
      return roleDAO.name
    }
  }
})
