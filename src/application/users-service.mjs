export const UsersService = ({ repository }) => ({
  async getById () {
    return await repository.getUsers()
  },

  async getAll () { return await repository.getUsers() }
})
