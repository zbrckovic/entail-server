export const userMapper = {
  toPresentation: ({ id, email, roles, isEmailVerified, createdAt }) => {
    return { id, email, roles, isEmailVerified, createdAt: createdAt.format() }
  }
}
