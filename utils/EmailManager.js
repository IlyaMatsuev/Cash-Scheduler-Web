const nodemailer = require('nodemailer');
const emailConfig = require('./../config').email;

let emailCredentials;
let transporter;

class EmailManager {
    static _constructor() {
        try {
            emailCredentials = require('./../credentials').email
        } catch (e) {
            emailCredentials = {
                username: process.env.EMAIL_USERNAME,
                password: process.env.EMAIL_PASSWORD
            };
        }
        transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailCredentials.username,
                pass: emailCredentials.password
            }
        });
    }

    static send(subject, body, to) {
        transporter.sendMail({from: emailCredentials.username, to: to, subject: subject, html: body,});
    }
}

EmailManager._constructor();

module.exports = EmailManager;
