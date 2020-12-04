import nodemailer from 'nodemailer'

export const EmailService = ({ environment, i18nService }) => {
  const t = i18nService.getT()

  const {
    emailServerHost,
    emailServerPort,
    emailServerUsername,
    emailServerPassword
  } = environment

  const transport = nodemailer.createTransport({
    pool: true,
    host: emailServerHost,
    port: emailServerPort,
    auth: {
      user: emailServerUsername,
      pass: emailServerPassword
    }
  })

  const verifyConnection = async () => transport.verify()

  const sendActivationCode = async (activationCode, recipientAddress) => {
    const from = 'authentication@entail.com'
    const to = recipientAddress
    const subject = t('activationEmail.subject')
    const text = t('activationEmail.text')

    return await transport.sendMail({ from, to, subject, text })
  }

  return { sendActivationCode, verifyConnection }
}
