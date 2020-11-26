export const UsersService = ({ usersRepository }) => ({
  getUsers: () => usersRepository.getUsers()
})
