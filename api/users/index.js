const express = require('express');
const db = require('./../../db');
const recordTypesRoute = require('./record-types');
const usersRoute = express.Router();

usersRoute.param('userId', (request, response, next, value) => {
    request.userId = value;
    next();
});

usersRoute.use('/:userId/record-types', recordTypesRoute);
usersRoute.get('/:userId', (request, response) => {
    db.users.findOne({
        where: {
            id: request.userId
        }
    }).then(user => {
        if (user === null) {
            throw new Error('Invalid request, check provided params');
        }
        response.json({user: user});
    }).catch(error => response.status(401).json({error: error.message}));
});
usersRoute.get('/', (request, response) => {
    db.users.findAll({ raw: true}).then(users => response.json({users: users}));
});


module.exports = usersRoute;
