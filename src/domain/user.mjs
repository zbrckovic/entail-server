import { v4 as uuid } from 'uuid'

export const User = ({
  id = uuid(),
  email,
  isEmailVerified = false,
  passwordHash,
  roles = []
} = {}) => ({
  id: id ?? uuid(),
  email: email,
  passwordHash: passwordHash,
  isEmailVerified,
  roles: roles
})

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}
