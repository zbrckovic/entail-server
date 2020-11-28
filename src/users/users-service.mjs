export const UsersService = ({ usersRepository }) => ({
  getUsers: () => usersRepository.getUsers(),
  createUser: user => usersRepository.createUser(user)
})
