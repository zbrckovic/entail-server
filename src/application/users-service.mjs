export const UsersService = ({ usersRepository }) => ({
  async getUsers (pageNumber, pageSize) {
    return await usersRepository.getUsers(pageNumber, pageSize)
  }
})
