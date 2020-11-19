export const createUserService = database => {
  const getUsers = () => database.getUsers()

  return { getUsers }
}
