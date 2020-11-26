import { Router } from 'express'
import { createResSubscriber } from './common.mjs'

export const UsersRouter = ({ usersService }) => {
  const router = new Router()

  router.get('/', (req, res) => {
    usersService
      .getUsers()
      .subscribe(createResSubscriber(res))
  })

  return router
}
