import { createUsersRouter } from './users-router.mjs'

export const createRouters = ({ usersService }) => {
  const usersRouter = createUsersRouter(usersService)

  return { usersRouter }
}
