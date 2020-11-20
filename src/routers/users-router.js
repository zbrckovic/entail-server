import { Router } from 'express'
import { createResSubscriber } from './common.js'

export const createUsersRouter = usersService => {
  const router = new Router()

  router.get('/', (req, res) => {
    usersService
      .getUsers()
      .subscribe(createResSubscriber(res))
  })

  return router
}
