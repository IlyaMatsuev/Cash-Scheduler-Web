const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const authRoute = express.Router();
const db = require('./../db').Users;
const config = require('./../config').crypt;

authRoute.post('/', async (request, response) => {
    const {email, password} = request.body;
    const user = await db.findOne({where: {email: email}});
    if (!user) {
        response.status(403).end();
    } else {
        bcrypt.compare(password, user.password, (err, passwordsMatch) => {
            if (passwordsMatch) {
                jwt.sign({user}, config.secretKey, {}, (err, token) => {
                    if (err) {
                        console.log(err.toString());
                        response.status(500).end();
                    } else {
                        response.json({
                            accessToken: token
                        });
                    }
                });
            } else {
                response.status(403).end();
            }
        });
    }
});

authRoute.post('/token', (request, response) => {
    // TODO: implement functionality for refreshing session with refresh tokens
    response.status(404).end();
});

module.exports = authRoute;
