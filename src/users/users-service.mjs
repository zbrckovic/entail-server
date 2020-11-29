import { createError, ErrorName } from '../error'

export const UsersService = ({ usersRepository, cryptographyService }) => ({
  register: async ({ email, password }) => {
    const passwordHash = await cryptographyService.createPasswordHash(password)
    return await usersRepository.createUser({ email, passwordHash })
  },

  login: async ({ email, password }) => {
    const user = await usersRepository.getUserByEmail(email)
    if (user === undefined) throw createError(ErrorName.INVALID_CREDENTIALS)

    const isPasswordOk = await cryptographyService.isPasswordCorrect(password, user.passwordHash)
    if (!isPasswordOk) throw createError(ErrorName.INVALID_CREDENTIALS)

    return user
  }
})
