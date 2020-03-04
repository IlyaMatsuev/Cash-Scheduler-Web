const express = require('express');
const jwt = require("jsonwebtoken");

const config = require('./../config').crypt;
const viewsRoute = express.Router();

viewsRoute.use('/', (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (authHeader && authHeader.startsWith(config.authType)) {
        jwt.verify(authHeader.split(config.authType).pop(), config.accessTokenSecret, (err, decoded) => {
            if (err) {
                response.redirect('/');
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        response.redirect('/');
    }
    /*const accessToken = request.query.token;
    if (accessToken) {
        jwt.verify(accessToken, config.accessTokenSecret, (err, decoded) => {
            if (err) {
                response.redirect('/');
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        response.redirect('/');
    }*/
});

viewsRoute.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

module.exports = viewsRoute;
