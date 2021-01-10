import { v4 as uuid } from 'uuid'

export const User = ({
  id = uuid(),
  email,
  isEmailVerified = false,
  passwordHash,
  roles = [],
  createdAt
} = {}) => ({
  id,
  email,
  passwordHash,
  isEmailVerified,
  roles,
  createdAt
})

export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}
