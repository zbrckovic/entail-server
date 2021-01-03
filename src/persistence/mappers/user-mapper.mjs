import { User } from '../../domain/user.mjs'
import { roleMapper } from './role-mapper.mjs'
import moment from 'moment'

export const userMapper = {
  fromPersistence ({ id, email, isEmailVerified, passwordHash, roles, createdAt }) {
    return User({
      id: id ?? undefined,
      email,
      isEmailVerified,
      passwordHash,
      roles: roles.map(role => roleMapper.fromPersistence(role)),
      createdAt: moment(createdAt)
    })
  },
  toPersistence ({ id, email, isEmailVerified, passwordHash }) {
    return {
      id: id ?? null,
      email,
      isEmailVerified,
      passwordHash
    }
  }
}
