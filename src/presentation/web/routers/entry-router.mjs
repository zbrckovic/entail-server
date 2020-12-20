import { Router } from 'express'
import { ErrorName } from '../../../common/error.mjs'
import { body } from 'express-validator'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../../common/constants.mjs'
import moment from 'moment'

export const EntryRouter = ({
  entryService,
  authenticationMiddlewareFactory: authentication,
  validationMiddlewareFactory: validation,
  environment
}) => {
  const router = new Router()

  const apiTokenCookieMaxAge = moment.duration(
    environment.apiTokenExpiresInMinutes,
    'minutes'
  ).asMilliseconds()

  router.post(
    '/register',
    validation.isValid(emailValidator, passwordValidator),
    async (req, res, next) => {
      try {
        const { body: { email, password } } = req
        const apiToken = await entryService.register({ email, password })
        res.cookie('apiToken', apiToken, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
        res.send()
      } catch (error) {
        const { name } = error
        if (name === ErrorName.INVALID_CREDENTIALS) {
          res.status(403).json({ name })
          return
        }
        if (name === ErrorName.EMAIL_ALREADY_USED) {
          res.status(409).json({ name })
          return
        }
        next(error)
      }
    })

  router.post(
    '/login',
    validation.isValid(emailValidator, passwordValidator),
    async (req, res, next) => {
      try {
        const { email, password } = req.body
        const apiToken = await entryService.login({ email, password })
        res.cookie('apiToken', apiToken, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
        res.send({ apiToken })
      } catch (error) {
        const { name } = error
        if (name === ErrorName.INVALID_CREDENTIALS) {
          res.status(403).json({ name })
          return
        }
        next(error)
      }
    })

  router.post(
    '/refreshApiToken',
    authentication.isAuthenticated({ requireActiveUser: false }),
    async (req, res, next) => {
      try {
        const { user } = req
        const apiToken = entryService.refreshApiToken(user.id)
        res.cookie('apiToken', apiToken, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
        res.send()
      } catch (error) {
        next(error)
      }
    })

  router.post(
    '/activate',
    authentication.isAuthenticated({ requireActiveUser: false }),
    async (req, res, next) => {
      try {
        const { user, body: { activationCode } } = req
        await entryService.activateUser(user.id, activationCode)
        res.send()
      } catch (error) {
        next(error)
      }
    })

  router.post(
    '/refreshActivationCode',
    authentication.isAuthenticated({ requireActiveUser: false }),
    async (req, res, next) => {
      try {
        const { user } = req
        await entryService.refreshActivationCode(user.id)
        res.send()
      } catch (error) {
        next(error)
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
