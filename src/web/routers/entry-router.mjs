import { Router } from 'express'
import { ErrorName } from '../../global/error.mjs'
import { body } from 'express-validator'
import { validate } from '../middleware.mjs'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../global/constants.mjs'

export const EntryRouter = ({ entryService, authenticationService }) => {
  const router = new Router()

  router.post(
    '/register',
    validate(emailValidator, passwordValidator),
    async (req, res, next) => {
      try {
        const { email, password } = req.body
        const user = await entryService.register({ email, password })
        const token = await authenticationService.generateToken(user)
        res.send({ token })
      } catch (error) {
        const { name } = error
        if (name === ErrorName.INVALID_CREDENTIALS) {
          res.status(403).json({ name })
        } else if (name === ErrorName.EMAIL_ALREADY_USED) {
          res.status(409).json({ name })
        } else {
          next(error)
        }
      }
    })

  router.post(
    '/login',
    validate(emailValidator, passwordValidator),
    async (req, res, next) => {
      try {
        const { email, password } = req.body
        const user = await entryService.login({ email, password })
        const token = await authenticationService.generateToken(user)
        res.send({ token })
      } catch (error) {
        const { name } = error
        if (name === ErrorName.INVALID_CREDENTIALS) {
          res.status(403).json({ name })
        } else {
          next(error)
        }
      }
    })

  return router
}

const emailValidator = body('email')
  .isEmail()
  .withMessage('must be a valid email address')
  .normalizeEmail()

const passwordValidator = body('password')
  .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
  .withMessage(
    `must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long`
  )
