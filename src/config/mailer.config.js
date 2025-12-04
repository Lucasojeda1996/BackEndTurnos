import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user:'lucaskappo22@gmail.com',
            pass: ENVIRONMENT.GMAIL_PASSWORD
        }
    }
)
export default transporter