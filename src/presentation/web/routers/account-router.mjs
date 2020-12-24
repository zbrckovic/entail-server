import { Router } from 'express'
import moment from 'moment'
import { body } from 'express-validator'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../../common/constants.mjs'

// Enables regular users to manage details related to their account and session.
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
    // Returns a fresh api token.
    .get(
      '/apiToken',
      async (req, res) => {
        const { sub } = req.token
        const newToken = await accountService.refreshApiToken(sub)
        res.cookie('token', newToken, { maxAge: apiTokenCookieMaxAge, httpOnly: true })
        res.send()
      }
    )
    // Initiates email verification procedure - sends an email with further instructions to the
    // user's email address.
    .post(
      '/requestEmailVerification',
      async (req, res) => {
        const { sub } = req.token
        await accountService.requestEmailVerification(sub)
        res.send()
      }
    )
    // Flags users email as verified. Uses provided `token` for verification.
    .post(
      '/verifyEmail',
      validation.isValid(body('token').isJWT()),
      async (req, res) => {
        const { sub } = req.token
        const { token } = req.body
        await accountService.verifyEmail(sub, token)
        res.send()
      }
    )
    // Initiates email verification procedure - sends an email with further instructions to the
    // user's email address.
    .post(
      '/requestPasswordChange',
      async (req, res) => {
        const { sub } = req.token
        await accountService.requestPasswordChange(sub)
        res.send()
      }
    )
    // Sets `password` as user's new password. Uses provided `token` for verification.
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
    // Sets `newPassword` as user's new password. Uses provided `oldPassword` for verification.
    .post(
      '/changePasswordWithOldPassword',
      validation.isValid(
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
