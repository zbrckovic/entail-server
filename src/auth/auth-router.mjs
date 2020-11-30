import { Router } from 'express'
import { ErrorName } from '../error.mjs'

export const AuthRouter = ({ authService }) => {
  const router = new Router()

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body
      await authService.login({ email, password })
      res.send()
    } catch (error) {
      const { name } = error
      if (name === ErrorName.INVALID_CREDENTIALS) res.status(403).send({ name })
      next(error)
    }
  })

  router.post('/register', async (req, res, next) => {
    try {
      const { email, password } = req.body
      await authService.register({ email, password })
      res.send()
    } catch (error) {
      const { name } = error
      if (name === ErrorName.INVALID_CREDENTIALS) res.status(403).send({ name })
      if (name === ErrorName.EMAIL_ALREADY_USED) res.status(409).send({ name })
      next(error)
    }
  })

  return router
}
