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
    async verifyConnection () {
      try {
        return await transport.verify()
      } catch (error) {
        console.error('Couldn\'t connect to SMTP server.')
        throw error
      }
    },

    async sendActivationCode (activationCode, recipientEmailAddress) {
      const from = 'authentication@entail.com'
      const to = recipientEmailAddress
      const subject = t('activationEmail.subject')
      const text = t('activationEmail.text')

      return await transport.sendMail({ from, to, subject, text })
    }
  }
}
