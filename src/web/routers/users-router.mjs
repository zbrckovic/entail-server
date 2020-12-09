import { Router } from 'express'
import { Permission } from '../permissions.mjs'

export const UsersRouter = ({ usersService, authenticationService, authorizationService }) => {
  const router = new Router()

  router.use(authenticationService.isAuthenticated())
  router.use(authorizationService.isAuthorized(Permission.USER_MANAGEMENT))

  router.get(
    '/',
    async (req, res) => {
      const users = await usersService.getAll()
      res.json({ users })
    }
  )

  return router
}
