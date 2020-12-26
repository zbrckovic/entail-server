import { Router } from 'express'
import moment from 'moment'
import { body } from 'express-validator'
import { isSufficientlyStrongPassword } from '../../validators.mjs'

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
      '/api-token',
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
      '/request-email-verification',
      async (req, res) => {
        const { sub } = req.token
        await accountService.requestEmailVerification(sub)
        res.send()
      }
    )
    // Flags users email as verified. Uses provided `token` for verification.
    .post(
      '/verify-email',
      validation.isValid(body('token').isJWT()),
      async (req, res) => {
        const { sub } = req.token
        const { token } = req.body
        await accountService.verifyEmail(sub, token)
        res.send()
      }
    )
    // Sets `newPassword` as user's new password. Uses provided `oldPassword` for verification.
    .post(
      '/change-password-with-old-password',
      validation.isValid(
        body('oldPassword').isString(),
        body('newPassword').custom(isSufficientlyStrongPassword)
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
