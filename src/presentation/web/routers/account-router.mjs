import { Router } from 'express'
import moment from 'moment'
import { body } from 'express-validator'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../../common/constants.mjs'

export const AccountRouter = ({
  environment,
  accountService,
  authenticationMiddlewareFactory: authentication,
  validationMiddlewareFactory: validation
}) => {
  const apiTokenCookieMaxAge = moment.duration(
    environment.apiTokenExpiresInMinutes,
    'minutes'
  ).asMilliseconds()

  return new Router()
    .use(authentication.isAuthenticated())
    .get(
      '/apiToken',
      async (req, res) => {
        const { sub } = req.token
        const newToken = await accountService.refreshApiToken(sub)
        res.cookie('token', newToken, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
        res.send()
      }
    )
    .post(
      '/requestEmailVerification',
      async (req, res) => {
        const { sub } = req.token
        await accountService.requestEmailVerification(sub)
        res.send()
      }
    )
    .post(
      '/verifyEmail',
      async (req, res) => {
        const { sub } = req.token
        const { token } = req.body
        await accountService.verifyEmail(sub, token)
        res.send()
      }
    )
    .post(
      '/requestPasswordChange',
      async (req, res) => {
        const { sub } = req.token
        await accountService.requestPasswordChange(sub)
        res.send()
      }
    )
    .post(
      '/changePasswordWithToken',
      validation.isValid(
        body('token').isJWT(),
        body('password').isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
      ),
      async (req, res) => {
        const { sub } = req.token
        const { password, token } = req.body
        await accountService.changePasswordWithToken({ userId: sub, password, token })
        res.send()
      }
    )
    .post(
      '/changePasswordWithOldPassword',
      validation.isValid(
        body('token').isJWT(),
        body('oldPassword').isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH }),
        body('newPassword').isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
      ),
      async (req, res) => {
        const { sub } = req.token
        const { oldPassword, newPassword } = req.body
        await accountService.changePasswordWithOldPassword({
          userId: sub,
          oldPassword,
          newPassword
        })
        res.send()
      }
    )
}
