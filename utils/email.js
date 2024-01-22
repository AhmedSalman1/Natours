const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
const Transport = require('nodemailer-brevo-transport');

// new Email(user, url).sendWelcome();
module.exports = class Email {
    constructor(user, url) {
        (this.to = user.email),
            (this.firstName = user.name.split(' ')[0]),
            (this.url = url),
            (this.from = `Ahmed Ali <${process.env.EMAIL_FROM}>`);
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //* Brevo
            return nodemailer.createTransport(
                new Transport({
                    apiKey: process.env.API_KEY,
                }),
            );

            // Way 2
            // return nodemailer.createTransport({
            //     service: 'Brevo',
            //     host: process.env.BREVO_HOST,
            //     post: process.env.BREVO_PORT,
            //     auth: {
            //         user: process.env.BREVO_LOGIN,
            //         pass: process.env.BREVO_PASSWORD,
            //     },
            // });
        }

        // 1) Create a transporter
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            // service: 'Gmail',
            // if you use gmail Active "less secure app" option
        });
    }

    //* Send the email
    async send(template, subject) {
        // 1) Render HTML based on email on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            },
        );

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html),
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)',
        );
    }
};
