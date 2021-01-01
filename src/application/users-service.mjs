export const UsersService = ({ usersRepository }) => ({
  async getUsers ({ pageNumber, pageSize, orderProp, orderDir }) {
    return await usersRepository.getUsers({ pageNumber, pageSize, orderProp, orderDir })
  }
})
