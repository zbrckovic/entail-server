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

  return Object.freeze({
    async verifyConnection () {
      return await transport.verify()
    },

    async sendActivationCode (activationCode, recipientAddress) {
      const from = 'authentication@entail.com'
      const to = recipientAddress
      const subject = t('activationEmail.subject')
      const text = t('activationEmail.text')

      return await transport.sendMail({ from, to, subject, text })
    }
  })
}
