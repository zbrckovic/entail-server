export const userMapper = {
  toPresentation: user => {
    const { id, email, roles, isEmailVerified } = user
    return { id, email, roles, isEmailVerified }
  }
}
