import { createUsersRouter } from './users-router.js'

export const createRouters = ({ usersService }) => {
  const usersRouter = createUsersRouter(usersService)

  return { usersRouter }
}
