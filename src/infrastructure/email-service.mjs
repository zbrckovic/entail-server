import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

export const EmailService = ({ environment, i18nService }) => {
  const t = i18nService.getT()

  const transport = nodemailer.createTransport({
    pool: true,
    host: environment.emailServerHost,
    port: environment.emailServerPort,
    auth: {
      user: environment.emailServerUsername,
      pass: environment.emailServerPassword
    }
  })

  const result = {
    // Throws if connection is not ok.
    async verifyConnection () {
      try {
        await transport.verify()
      } catch (error) {
        console.error('Couldn\'t connect to SMTP server.')
        throw error
      }
    },

    async sendEmailVerificationToken (token, address) {
      const from = 'authentication@entail.com'
      const to = address
      const subject = t('verificationEmail.subject')
      const url = buildVerifyEmailUrl(token)
      const text = t('verificationEmail.text', { url })

      const html = await renderEmail(
        'verify-email.html',
        {
          text: t('verificationEmail.html.text'),
          url
        })

      await transport.sendMail({ from, to, subject, text, html })
    },

    async sendPasswordChangeToken (token, address) {
      const from = 'authentication@entail.com'
      const to = address
      const subject = t('passwordChangeEmail.subject')
      const url = buildChangePasswordUrl(token)
      const text = t('passwordChangeEmail.text', { url })

      const html = await renderEmail(
        'change-password.html',
        {
          text: t('passwordChangeEmail.html.text'),
          url
        }
      )

      await transport.sendMail({ from, to, subject, text, html })
    }
  }

  const renderEmail = (filename, data) => {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.resolve('src', 'infrastructure', 'email-service-templates', filename),
        data,
        {},
        (err, str) => {
          if (err) {
            reject(err)
          } else {
            resolve(str)
          }
        }
      )
    })
  }

  const buildVerifyEmailUrl = token => `${environment.uiUrl}/verify-email/${token}`
  const buildChangePasswordUrl = token => `${environment.uiUrl}/change-password/${token}`

  return result
}
