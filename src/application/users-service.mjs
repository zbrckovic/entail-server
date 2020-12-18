export const UsersService = ({ repository }) =>
  Object.freeze({
    async getAll () { return await repository.getUsers() }
  })
