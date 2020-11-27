export const UsersService = ({ repository }) => ({
  getUsers: () => repository.getUsers(),
  createUser: user => repository.createUser(user)
})
