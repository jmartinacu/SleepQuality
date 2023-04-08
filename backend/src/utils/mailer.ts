import nodemailer, { SendMailOptions } from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
})

export default async function sendEmail (payload: SendMailOptions): Promise<void> {
  transporter.sendMail(payload, (error, info) => {
    if (error !== null) {
      console.error(error, 'Error sending email')
      return
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
  })
}
