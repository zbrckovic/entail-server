export const UsersRepository = ({ databaseClient }) => ({
  getUsers: () => databaseClient.getUsers()
})
