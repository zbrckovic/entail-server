import { Router } from 'express'

export const AuthRouter = ({ authService }) => {
  const router = new Router()

  router.post('/register', async (req, res) => {
    // TODO: finish this
    res.json('registration')
  })

  return router
}
