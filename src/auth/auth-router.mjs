import { Router } from 'express'
import { createError, ErrorName } from '../error.mjs'

export const AuthRouter = ({ authService }) => {
  const router = new Router()

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body

      await authService.login({ email, password })

      res.send()
    } catch (error) {
      const { name } = error

      if (name === ErrorName.INVALID_CREDENTIALS) {
        next(createError({ name, status: 403 }))
      }

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

      if (name === ErrorName.INVALID_CREDENTIALS) {
        next(createError({ name, status: 403 }))
      }

      next(error)
    }
  })

  return router
}
