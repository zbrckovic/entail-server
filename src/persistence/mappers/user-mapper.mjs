import { User } from '../../domain/user.mjs'
import moment from 'moment'

export const userMapper = {
  fromPersistence ({ id, email, isEmailVerified, passwordHash, roles, createdAt }) {
    return User({
      id,
      email,
      isEmailVerified,
      passwordHash,
      roles: roles?.map(roleDAO => roleMapper.fromPersistence(roleDAO)),
      createdAt: moment(createdAt)
    })
  },
  toPersistence ({ id = null, email, isEmailVerified, passwordHash }) {
    return { id, email, isEmailVerified, passwordHash }
  }
}

export const roleMapper = {
  fromPersistence (role) { return role.name },
  toPersistence (role) { return { name: role } }
}
