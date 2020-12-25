import { Router } from 'express'
import { ErrorName } from '../../../common/error.mjs'
import moment from 'moment'
import { body } from 'express-validator'
import { isSufficientlyStrongPassword } from '../../validators.mjs'

export const EntryRouter = ({
  environment,
  entryService,
  validationMiddlewareFactory: validation
}) => {
  const apiTokenCookieMaxAge = moment.duration(
    environment.apiTokenExpiresInMinutes,
    'minutes'
  ).asMilliseconds()

  return new Router()
    .post(
      '/register',
      validation.isValid(
        body('email').normalizeEmail().isEmail(),
        body('password').custom(isSufficientlyStrongPassword)
      ),
      async (req, res, next) => {
        try {
          const { body: { email, password } } = req
          const token = await entryService.register({ email, password })
          res.cookie('token', token, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
          res.send()
        } catch (error) {
          const { name } = error
          if (name === ErrorName.EMAIL_ALREADY_USED) {
            res.status(409).json({ name })
            return
          }
          next(error)
        }
      })
    .post(
      '/login',
      validation.isValid(
        body('email').normalizeEmail().isEmail(),
        body('password').isString()
      ),
      async (req, res, next) => {
        try {
          const { email, password } = req.body
          const token = await entryService.login({ email, password })
          res.cookie('token', token, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
          res.send()
        } catch (error) {
          const { name } = error
          if (name === ErrorName.INVALID_CREDENTIALS) {
            res.status(403).json({ name })
            return
          }
          next(error)
        }
      })
}
