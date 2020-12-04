export const UsersService = ({ usersRepository }) => {
  const getAll = async () => usersRepository.getUsers()

  return { getAll }
}
