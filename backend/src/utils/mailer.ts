import config from 'config'
import nodemailer, { type SendMailOptions } from 'nodemailer'

const smpt = config.get<{
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}>('smpt')

const transporter = nodemailer.createTransport({
  ...smpt,
  auth: {
    user: smpt.auth.user,
    pass: smpt.auth.pass
  }
})

async function sendEmail (payload: SendMailOptions): Promise<void> {
  transporter.sendMail(payload, (error, info) => {
    if (error !== null) {
      console.error(error, 'Error sending email')
      return
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
  })
}

export default sendEmail
