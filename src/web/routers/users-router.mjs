import { Router } from 'express'

export const UsersRouter = ({ usersService, authenticationService }) => {
  const router = new Router()

  router.get(
    '/',
    authenticationService.isAuthenticated(),
    async (req, res) => {
      const users = await usersService.getAll()
      res.json({ users })
    }
  )

  return router
}
