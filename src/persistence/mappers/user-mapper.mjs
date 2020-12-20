import { User } from '../../domain/user.mjs'
import { activationStatusMapper } from './activation-status-mapper.mjs'
import { sessionMapper } from './session-mapper.mjs'
import { roleMapper } from './role-mapper.mjs'

export const userMapper = {
  fromPersistence ({
    id,
    email,
    passwordHash,
    activationStatus,
    roles
  }) {
    return User({
      id: id ?? undefined,
      email,
      passwordHash,
      activationStatus: activationStatusMapper.fromPersistence(activationStatus),
      roles: roles.map(role => roleMapper.fromPersistence(role))
    })
  },
  toPersistence ({
    id,
    email,
    passwordHash
  }) {
    return {
      id: id ?? null,
      email,
      passwordHash
    }
  }
}
