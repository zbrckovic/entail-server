import nodemailer from 'nodemailer'

export const EmailService = ({ environment }) => {
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
    const subject = 'Activation'
    const text = 'Content of activation'

    return await transport.sendMail({ from, to, subject, text })
  }

  return { sendActivationCode, verifyConnection }
}
