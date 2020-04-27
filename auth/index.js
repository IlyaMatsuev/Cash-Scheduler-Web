const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authRoute = express.Router();
const db = require('./../db').Users;
const securityConfig = require('./../config').crypt;
const emailConfig = require('./../config').email;
const errorsHandler = require('./../errors');
const tokensHandler = require('./tokensHandler');

authRoute.post('/register', (request, response) => {
    const {first_name, last_name, email, password, confirmedPassword} = request.body;

    if (
        !password
        || password.length < securityConfig.passwordMinLen
        || password.length > securityConfig.passwordMaxLen
    ) {
        errorsHandler.throwHttpError(response, 2, 400);
        return;
    }

    if (password !== confirmedPassword) {
        errorsHandler.throwHttpError(response, 6, 400);
        return;
    }

    bcrypt.hash(password, securityConfig.salt)
        .then(hash => db.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hash
        })).then(user => response.json(user))
        .catch(error => errorsHandler.throwHttpError(
            response,
            error.errors ? error.errors.map(err => err.message) : 1,
            400
        ));
});

authRoute.post('/login', async (request, response) => {
    const {email, password} = request.body;
    const user = await db.findOne({where: {email: email}});
    if (user) {
        bcrypt.compare(password, user.password, (err, passwordsMatch) => {
            if (passwordsMatch) {
                tokensHandler.generateTokens(user)
                    .then(tokens => {
                        response.json(tokens);
                        tokensHandler.registerNewToken(tokens);
                    }).catch(() => errorsHandler.throwHttpError(response));
            } else {
                errorsHandler.throwHttpError(response, 3, 403);
            }
        });
    } else {
        errorsHandler.throwHttpError(response, 3, 403);
    }
});

authRoute.post('/logout', (request, response) => {
    const accessToken = request.body.accessToken;
    if (tokensHandler.unregisterTokenByAccessToken(accessToken)) {
        response.json({});
    } else {
        errorsHandler.throwHttpError(response, 12, 400);
    }
});

authRoute.post('/change-password', async (request, response) => {
    const {email, password} = request.body;

    if (
        !password
        || password.length < securityConfig.passwordMinLen
        || password.length > securityConfig.passwordMaxLen
    ) {
        errorsHandler.throwHttpError(response, 2, 400);
        return;
    }

    const user = await db.findOne({where: {email: email}});
    if (user) {
        bcrypt.hash(password, securityConfig.salt)
            .then(hash => db.update({password: hash}, {where: {id: user.id}, returning: true}))
            .then(user => response.json(user))
            .catch(error => errorsHandler.throwHttpError(
                response,
                error.errors ? error.errors.map(err => err.message) : 1,
                400
            ));
    } else {
        errorsHandler.throwHttpError(response, 3, 403);
    }
});

authRoute.post('/send-code', async (request, response) => {
    const {email} = request.body;

    if (!email) {
        errorsHandler.throwHttpError(response, 7, 400);
    } else {
        const user = await db.findOne({where: {email: email}});

        if (!user) {
            errorsHandler.throwHttpError(response, 8, 400);
            return;
        }

        let emailCredentials;
        try {
            emailCredentials = require('./../credentials').email
        } catch (e) {
            emailCredentials = {
                username: process.env.EMAIL_USERNAME,
                password: process.env.EMAIL_PASSWORD
            };
        }

        const transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailCredentials.username,
                pass: emailCredentials.password
            }
        });
        const verificationToken = tokensHandler.generateVerificationToken();
        tokensHandler.registerVerificationToken(email, verificationToken);
        transporter.sendMail({
            from: emailCredentials.username,
            to: email,
            subject: emailConfig.verificationSubject,
            text: emailConfig.verificationContent + verificationToken
        });
        response.end();
    }
});

authRoute.post('/verify', (request, response) => {
    const {email, code} = request.body;

    if (!email || !code) {
        errorsHandler.throwHttpError(response, 10, 400);
        return;
    }
    if (!tokensHandler.compareVerificationTokens(email, code)) {
        errorsHandler.throwHttpError(response, 11, 400);
        return;
    }
    response.end();
});

authRoute.post('/token', async (request, response) => {
    const {email, refreshToken} = request.body;

    if (tokensHandler.isRefreshTokenRegistered(refreshToken)) {
        const user = await db.findOne({where: {email: email}});
        tokensHandler.generateTokens(user)
            .then(tokens => {
                response.json(tokens);
                tokensHandler.unregisterToken(tokens.refreshToken);
                tokensHandler.registerNewToken(tokens);
            }).catch(() => errorsHandler.throwHttpError(response));
    } else {
        errorsHandler.throwHttpError(response, 4, 400);
    }
});

authRoute.post('/access', (request, response) => {
    const {accessToken} = request.body;

    jwt.verify(accessToken, securityConfig.accessTokenSecret, err => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                errorsHandler.throwHttpError(response, 5, 401);
            } else {
                response.redirect('/');
            }
        } else {
            response.end();
        }
    });
});

module.exports = authRoute;
