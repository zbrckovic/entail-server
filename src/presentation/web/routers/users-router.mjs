import { Router } from 'express'
import { Permission } from '../../../infrastructure/permissions.mjs'

export const UsersRouter = ({
  usersService,
  authenticationMiddlewareFactory: authentication,
  authorizationMiddlewareFactory: authorization
}) => {
  const router = new Router()

  router.use(authentication.isAuthenticated())
  router.use(authorization.isAuthorized(Permission.USER_MANAGEMENT))

  router.get(
    '/',
    async (req, res) => {
      const users = await usersService.getAll()
      const userDTOs = users.map(user => {
        const { id, passwordHash, ...rest } = user
        return { ...rest }
      })
      res.json({ users: userDTOs })
    }
  )

  return router
}
