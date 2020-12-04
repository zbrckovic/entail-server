import { Router } from 'express'

export const UsersRouter = ({ usersService }) => {
  const router = new Router()

  router.get('/', async (req, res) => {
    const users = await usersService.getAll()
    res.json({ users })
  })

  return router
}
