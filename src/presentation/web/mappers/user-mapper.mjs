export const userMapper = {
  toPresentation: ({ passwordHash, createdAt, ...userRest }) => {
    return { ...userRest, createdAt: createdAt.format() }
  }
}
