import '@but/config'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

export async function sendEmail(
    to: string,
    subject: string,
    html: string
) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        html
    });
}
