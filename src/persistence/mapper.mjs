import stampit from '@stamp/it'
import { User } from '../domain/user.mjs'

export const Mapper = stampit({
  methods: {
    userFromDAO ({
      id,
      email,
      passwordHash,
      isActivated,
      activationCode,
      roles: roleDAOs
    }) {
      return User({
        id,
        email,
        passwordHash,
        isActivated,
        activationCode: activationCode ?? undefined,
        roles: roleDAOs.map(roleDAO => this.roleFromDAO(roleDAO))
      })
    },
    userToDAO ({ id, email, passwordHash, isActivated, activationCode, roles }) {
      return {
        id,
        email,
        passwordHash,
        isActivated,
        activationCode,
        roles: roles.map(role => this.roleToDAO(role))
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
