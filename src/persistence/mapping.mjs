export const userToRecord = ({ id, email, passwordHash }) => (
  { id, email, password: passwordHash }
)

export const userFromRecord = ({ id, email, password }) => (
  { id, email, passwordHash: password }
)
