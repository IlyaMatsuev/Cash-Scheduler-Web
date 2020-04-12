const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const errorsHandler = require('./../errors');
const config = require('./../config');
const Notifications = require('./../db').Notifications;

const layoutsDirPath = __dirname + '/layouts/';
const templatesDirPath = __dirname + '/templates/';
const viewsRoute = express.Router();

viewsRoute.use('/template', (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (authHeader && authHeader.startsWith(config.crypt.authType)) {
        const accessToken = authHeader.split(config.crypt.authType).pop();
        jwt.verify(accessToken, config.crypt.accessTokenSecret, (err, decoded) => {
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

viewsRoute.ws('/notifications', clientSocket => {
    const sendNewNotifications = user => {
        let newNotifications = Notifications.findAll({where: {user_id: user.id, read: false}});
        if (newNotifications.length > 0) {
            clientSocket.send(JSON.stringify({notifications: newNotifications}));
        }
    };
    let connectionSet = false;
    let refreshNotificationsTimer;

    clientSocket.on('message', message => {
        if (!connectionSet) {
            try {
                const {accessToken} = JSON.parse(message.toString());
                connectionSet = true;
                jwt.verify(accessToken, config.crypt.accessTokenSecret, (err, decoded) => {
                    if (err) {
                        throw err;
                    } else {
                        sendNewNotifications(decoded.user);
                        refreshNotificationsTimer = setInterval(sendNewNotifications, config.notifications.refreshInterval, decoded.user);
                    }
                });
            } catch (e) {
                if (e.name && e.name === 'TokenExpiredError') {
                    errorsHandler.throwWebSocketError(clientSocket, 5);
                } else {
                    errorsHandler.throwWebSocketError(clientSocket, e);
                }
            }
        }
    });
    clientSocket.on('close', () => {
        if (refreshNotificationsTimer) {
            clearInterval(refreshNotificationsTimer);
        }
    });
});

module.exports = viewsRoute;
