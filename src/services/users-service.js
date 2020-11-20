export const createUsersService = database => {
  const getUsers = () => database.getUsers()

  return { getUsers }
}
