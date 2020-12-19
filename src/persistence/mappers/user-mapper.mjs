import { User } from '../../domain/user.mjs'
import { activationStatusMapper } from './activation-status-mapper.mjs'
import { sessionMapper } from './session-mapper.mjs'
import { roleMapper } from './role-mapper.mjs'

export const userMapper = Object.freeze({
  fromPersistence ({
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
      activationStatus: activationStatusMapper.fromPersistence(activationStatus),
      session: session !== null ? sessionMapper.fromPersistence(session) : undefined,
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
})
