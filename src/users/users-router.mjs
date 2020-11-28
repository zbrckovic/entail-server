import { Router } from 'express'

export const UsersRouter = ({ usersService }) => {
  const router = new Router()

  router.get('/', (req, res) => {
    usersService
      .getUsers()
      .then(
        users => { res.json({ success: users }) },
        error => { res.json({ error }) }
      )
  })

  return router
}
