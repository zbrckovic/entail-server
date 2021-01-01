import { Router } from 'express'
import { query } from 'express-validator'
import { userMapper } from '../mappers/user-mapper.mjs'
import { Permission } from '../../../infrastructure/permissions.mjs'

export const UsersRouter = ({
  usersService,
  authenticationMiddlewareFactory: authentication,
  validationMiddlewareFactory: validation,
  authorizationMiddlewareFactory: authorization
}) => {
  return new Router()
    .use(authentication.isAuthenticated())
    .use(authorization.isAuthorized(Permission.USER_MANAGEMENT))
    .get(
      '/',
      validation.isValid(
        query('pageNumber').isInt({ min: 0 }),
        query('pageSize').isInt({ min: 1 })
      ),
      async (req, res, next) => {
        try {
          const { query } = req
          const pageNumber = parseInt(query.pageNumber, 10)
          const pageSize = parseInt(query.pageSize, 10)
          const pageInfo = await usersService.getUsers(pageNumber, pageSize)
          const items = pageInfo.items.map(user => userMapper.toPresentation(user))
          res.json({ ...pageInfo, items })
        } catch (error) {
          next(error)
        }
      }
    )
}
