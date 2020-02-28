const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const authRoute = express.Router();
const db = require('./../db').Users;
const config = require('./../config').crypt;
const errorsHandler = require('./../errors');

authRoute.post('/register', (request, response) => {
    const {first_name, last_name, email, password} = request.body;

    if (
        !password
        || password.length < config.passwordMinLen
        || password.length > config.passwordMaxLen
    ) {
        errorsHandler.throwHttpError(response, 2, 400);
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
                jwt.sign(
                    {user},
                    config.secretKey,
                    {expiresIn: 60 * config.tokenExpMinutes},
                    (err, token) => {
                        if (err) {
                            errorsHandler.throwHttpError(response);
                        } else {
                            response.json({accessToken: token});
                        }
                    }
                );
            } else {
                errorsHandler.throwHttpError(response, 3, 403);
            }
        });
    } else {
        errorsHandler.throwHttpError(response, 3, 403);
    }
});

authRoute.post('/token', (request, response) => {
    // TODO: implement functionality for refreshing session with refresh tokens
    errorsHandler.throwHttpError(response, null, 404);
});

module.exports = authRoute;
