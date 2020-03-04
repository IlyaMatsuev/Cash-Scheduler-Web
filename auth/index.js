const express = require('express');
const bcrypt = require("bcrypt");

const authRoute = express.Router();
const db = require('./../db').Users;
const config = require('./../config').crypt;
const errorsHandler = require('./../errors');
const tokensHandler = require('./tokensHandler');

authRoute.post('/register', (request, response) => {
    const {first_name, last_name, email, password, confirmedPassword} = request.body;

    if (
        !password
        || password.length < config.passwordMinLen
        || password.length > config.passwordMaxLen
    ) {
        errorsHandler.throwHttpError(response, 2, 400);
        return;
    }

    if (password !== confirmedPassword) {
        errorsHandler.throwHttpError(response, 6, 400);
        return;
    }

    bcrypt.hash(password, config.salt)
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

authRoute.post('/token', async (request, response) => {
    const {email, password, refreshToken} = request.body;
    const user = await db.findOne({where: {email: email}});
    if (user) {
        bcrypt.compare(password, user.password, (err, passwordsMatch) => {
            if (passwordsMatch) {
                if (tokensHandler.isRefreshTokenRegistered(refreshToken)) {
                    tokensHandler.generateTokens(user)
                        .then(tokens => {
                            response.json(tokens);
                            tokensHandler.unregisterToken(tokens.refreshToken);
                            tokensHandler.registerNewToken(tokens);
                        }).catch(() => errorsHandler.throwHttpError(response));
                } else {
                    errorsHandler.throwHttpError(response, 4, 400);
                }
            } else {
                errorsHandler.throwHttpError(response, 3, 403);
            }
        });
    } else {
        errorsHandler.throwHttpError(response, 3, 403);
    }
});

module.exports = authRoute;
