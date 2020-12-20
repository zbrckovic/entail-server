import { User } from '../../domain/user.mjs'
import { roleMapper } from './role-mapper.mjs'

export const userMapper = {
  fromPersistence ({ id, email, isEmailVerified, passwordHash, roles }) {
    return User({
      id: id ?? undefined,
      email,
      isEmailVerified,
      passwordHash,
      roles: roles.map(role => roleMapper.fromPersistence(role))
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
