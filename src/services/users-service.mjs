export const createUsersService = repository => {
  const getUsers = () => repository.getUsers()

  return { getUsers }
}
