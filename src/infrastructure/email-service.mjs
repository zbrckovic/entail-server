import nodemailer from 'nodemailer'
import stampit from '@stamp/it'

export const EmailService = stampit({
  init ({ environment, i18nService }) {
    this.t = i18nService.t

    this.transport = nodemailer.createTransport({
      pool: true,
      host: environment.emailServerHost,
      port: environment.emailServerPort,
      auth: {
        user: environment.emailServerUsername,
        pass: environment.emailServerPassword
      }
    })
  },
  methods: {
    async verifyConnection () {
      return await this.transport.verify()
    },

    async sendActivationCode (activationCode, recipientAddress) {
      const from = 'authentication@entail.com'
      const to = recipientAddress
      const subject = this.t('activationEmail.subject')
      const text = this.t('activationEmail.text')

      return await this.transport.sendMail({ from, to, subject, text })
    }
  }
})
