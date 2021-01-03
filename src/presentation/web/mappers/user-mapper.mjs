export const userMapper = {
  toPresentation: user => {
    const { id, email, roles, isEmailVerified, createdAt } = user
    return { id, email, roles, isEmailVerified, createdAt: createdAt.format() }
  }
}
