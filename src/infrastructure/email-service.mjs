import nodemailer from 'nodemailer'

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

  return {
    // Throws if connection is not ok.
    async verifyConnection () {
      try {
        await transport.verify()
      } catch (error) {
        console.error('Couldn\'t connect to SMTP server.')
        throw error
      }
    },

    async sendEmailVerificationToken (emailVerificationToken, recipientEmailAddress) {
      const from = 'authentication@entail.com'
      const to = recipientEmailAddress
      const subject = t('verificationEmail.subject')
      const text = `${t('verificationEmail.text')}\n${emailVerificationToken}`

      await transport.sendMail({ from, to, subject, text })
    },

    async sendPasswordChangeToken (passwordChangeToken, recipientEmailAddress) {
      const from = 'authentication@entail.com'
      const to = recipientEmailAddress
      const subject = t('passwordChangeEmail.subject')
      const text = `${t('passwordChangeEmail.text')}\n${passwordChangeToken}`

      await transport.sendMail({ from, to, subject, text })
    }
  }
}
