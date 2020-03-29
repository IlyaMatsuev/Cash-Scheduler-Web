const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const errorsHandler = require('./../errors');
const config = require('./../config').crypt;

const layoutsDirPath = __dirname + '/layouts/';
const templatesDirPath = __dirname + '/templates/';
const viewsRoute = express.Router();

viewsRoute.use('/template', (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (authHeader && authHeader.startsWith(config.authType)) {
        const accessToken = authHeader.split(config.authType).pop();
        jwt.verify(accessToken, config.accessTokenSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    errorsHandler.throwHttpError(response, 5, 401);
                } else {
                    errorsHandler.throwHttpError(response, null, 403);
                }
            } else {
                request.user = decoded.user;
                next();
            }
        });
    } else {
        errorsHandler.throwHttpError(response, null, 403);
    }
});

viewsRoute.get('/', (request, response) => {
    response.sendFile(layoutsDirPath + 'profile-main.html');
});

viewsRoute.get('/template', (request, response) => {
    const templateName = request.query.name;
    const templatePath = templatesDirPath + templateName + '.html';
    fs.stat(templatePath, err => {
        if (err) {
            errorsHandler.throwHttpError(response, null, 404);
        } else {
            response.sendFile(templatePath);
        }
    });
});

module.exports = viewsRoute;
